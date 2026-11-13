<?php

namespace App\Services;

use App\Models\ClassGroup;
use App\Models\DataImport;
use App\Models\DocumentSequence;
use App\Models\Family;
use App\Models\Guardian;
use App\Models\School;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class StudentImportService
{
    public function __construct(private readonly DocumentNumberService $numbers) {}

    /**
     * @return array{rows: list<array<string, mixed>>, errors: list<array{row: int, message: string}>}
     */
    public function preview(UploadedFile $file, int $schoolId): array
    {
        $handle = fopen($file->getRealPath(), 'r');
        if ($handle === false) {
            return ['rows' => [], 'errors' => [['row' => 0, 'message' => 'Could not read the uploaded file.']]];
        }

        $header = fgetcsv($handle);
        if ($header === false) {
            fclose($handle);

            return ['rows' => [], 'errors' => [['row' => 0, 'message' => 'The CSV file is empty.']]];
        }

        $header = array_map(fn ($col) => Str::of((string) $col)->trim()->lower()->replace(' ', '_')->toString(), $header);
        $rows = [];
        $errors = [];
        $line = 1;

        while (($data = fgetcsv($handle)) !== false) {
            $line++;
            if (count(array_filter($data, fn ($v) => $v !== null && $v !== '')) === 0) {
                continue;
            }

            $record = [];
            foreach ($header as $i => $key) {
                $record[$key] = isset($data[$i]) ? trim((string) $data[$i]) : '';
            }

            $rowErrors = $this->validateRow($record, $schoolId, $line);
            if ($rowErrors !== []) {
                foreach ($rowErrors as $message) {
                    $errors[] = ['row' => $line, 'message' => $message];
                }
            }

            $record['_line'] = $line;
            $record['_valid'] = $rowErrors === [];
            $rows[] = $record;
        }

        fclose($handle);

        return ['rows' => $rows, 'errors' => $errors];
    }

    /**
     * @param  array<string, mixed>  $record
     * @return list<string>
     */
    private function validateRow(array $record, int $schoolId, int $line): array
    {
        $errors = [];
        if (($record['first_name'] ?? '') === '') {
            $errors[] = 'first_name is required';
        }
        if (($record['last_name'] ?? '') === '') {
            $errors[] = 'last_name is required';
        }
        if (($record['gender'] ?? '') !== '' && ! in_array(strtolower((string) $record['gender']), ['male', 'female', 'other'], true)) {
            $errors[] = 'gender must be male, female or other';
        }

        $admission = $record['admission_number'] ?? '';
        if ($admission !== '' && Student::query()->where('school_id', $schoolId)->where('admission_number', $admission)->exists()) {
            $errors[] = 'admission_number already exists';
        }

        $className = $record['class_name'] ?? '';
        if ($className !== '' && ! ClassGroup::query()->where('school_id', $schoolId)->where('name', $className)->exists()) {
            $errors[] = 'class_name does not match a class at this school';
        }

        return $errors;
    }

    public function commit(DataImport $import): int
    {
        if ($import->status === 'committed') {
            return (int) $import->committed_count;
        }

        $school = School::findOrFail($import->school_id);
        $count = 0;

        DB::transaction(function () use ($import, $school, &$count) {
            foreach ($import->rows ?? [] as $record) {
                if (! ($record['_valid'] ?? false)) {
                    continue;
                }

                $admission = $record['admission_number'] !== ''
                    ? $record['admission_number']
                    : $this->numbers->next($school, DocumentSequence::TYPE_ADMISSION);

                $student = Student::create([
                    'school_id' => $school->id,
                    'admission_number' => $admission,
                    'first_name' => $record['first_name'],
                    'last_name' => $record['last_name'],
                    'gender' => strtolower($record['gender'] ?: 'other'),
                    'date_of_birth' => $record['date_of_birth'] !== '' ? $record['date_of_birth'] : null,
                    'status' => 'active',
                    'enrollment_date' => now(),
                ]);

                $className = $record['class_name'] ?? '';
                if ($className !== '') {
                    $class = ClassGroup::query()->where('school_id', $school->id)->where('name', $className)->first();
                    if ($class) {
                        $student->enrollments()->create([
                            'school_id' => $school->id,
                            'academic_year_id' => $class->academic_year_id,
                            'class_group_id' => $class->id,
                            'status' => 'enrolled',
                        ]);
                    }
                }

                $guardianName = $record['guardian_name'] ?? '';
                if ($guardianName !== '') {
                    $parts = preg_split('/\s+/', trim($guardianName), 2) ?: [$guardianName];
                    $guardian = Guardian::create([
                        'school_id' => $school->id,
                        'first_name' => $parts[0],
                        'last_name' => $parts[1] ?? '',
                        'phone' => $record['guardian_phone'] ?? null,
                        'email' => $record['guardian_email'] ?? null,
                    ]);

                    $familyName = $record['family_name'] ?: ($parts[1] ?? $parts[0]).' family';
                    $family = Family::firstOrCreate(
                        ['school_id' => $school->id, 'name' => $familyName],
                        ['payer_guardian_id' => $guardian->id],
                    );

                    $student->update([
                        'family_id' => $family->id,
                        'responsible_guardian_id' => $guardian->id,
                    ]);

                    $student->guardians()->attach($guardian->id, [
                        'relationship' => $record['guardian_relationship'] ?: 'parent',
                        'is_primary' => true,
                    ]);
                }

                $count++;
            }

            $import->update([
                'status' => 'committed',
                'committed_count' => $count,
                'committed_at' => now(),
            ]);
        });

        return $count;
    }

    public function template(): string
    {
        return implode(',', [
            'admission_number',
            'first_name',
            'last_name',
            'gender',
            'date_of_birth',
            'class_name',
            'guardian_name',
            'guardian_phone',
            'guardian_email',
            'guardian_relationship',
            'family_name',
        ])."\n";
    }
}
