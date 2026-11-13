<?php

namespace App\Services;

use App\Models\DocumentSequence;
use App\Models\School;
use Illuminate\Support\Facades\DB;

class DocumentNumberService
{
    /**
     * @var array<string, array{prefix: string, padding: int}>
     */
    private const DEFAULTS = [
        DocumentSequence::TYPE_ADMISSION => ['prefix' => 'ADM', 'padding' => 5],
        DocumentSequence::TYPE_INVOICE => ['prefix' => 'INV', 'padding' => 5],
        DocumentSequence::TYPE_RECEIPT => ['prefix' => 'RCPT', 'padding' => 5],
        DocumentSequence::TYPE_APPLICATION => ['prefix' => 'APP', 'padding' => 5],
    ];

    public function next(School|int $school, string $type): string
    {
        $schoolId = $school instanceof School ? $school->id : $school;

        return DB::transaction(function () use ($schoolId, $type) {
            $sequence = DocumentSequence::query()
                ->where('school_id', $schoolId)
                ->where('document_type', $type)
                ->lockForUpdate()
                ->first();

            if ($sequence === null) {
                $defaults = self::DEFAULTS[$type] ?? ['prefix' => strtoupper(substr($type, 0, 3)), 'padding' => 5];
                $sequence = DocumentSequence::create([
                    'school_id' => $schoolId,
                    'document_type' => $type,
                    'prefix' => $defaults['prefix'],
                    'include_year' => true,
                    'padding' => $defaults['padding'],
                    'next_number' => 1,
                ]);
            }

            $number = $sequence->next_number;
            $sequence->update(['next_number' => $number + 1]);

            $parts = [$sequence->prefix];
            if ($sequence->include_year) {
                $parts[] = (string) now()->year;
            }
            $parts[] = str_pad((string) $number, (int) $sequence->padding, '0', STR_PAD_LEFT);

            return implode('-', $parts);
        });
    }

    /**
     * @return list<DocumentSequence>
     */
    public function forSchool(int $schoolId): array
    {
        $existing = DocumentSequence::query()
            ->where('school_id', $schoolId)
            ->get()
            ->keyBy('document_type');

        foreach (array_keys(self::DEFAULTS) as $type) {
            if (! $existing->has($type)) {
                $defaults = self::DEFAULTS[$type];
                $existing[$type] = DocumentSequence::create([
                    'school_id' => $schoolId,
                    'document_type' => $type,
                    'prefix' => $defaults['prefix'],
                    'include_year' => true,
                    'padding' => $defaults['padding'],
                    'next_number' => 1,
                ]);
            }
        }

        return $existing->values()->all();
    }
}
