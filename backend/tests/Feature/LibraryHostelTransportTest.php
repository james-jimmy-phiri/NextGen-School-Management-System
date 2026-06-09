<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\Book;
use App\Models\BookBorrowing;
use App\Models\HostelAllocation;
use App\Models\HostelRoom;
use App\Models\LeaveRequest;
use App\Models\Payroll;
use App\Models\School;
use App\Models\StaffProfile;
use App\Models\Student;
use App\Models\StudentTransport;
use App\Models\Subscription;
use App\Models\SupportTicket;
use App\Models\TransportRoute;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LibraryHostelTransportTest extends TestCase
{
    use RefreshDatabase;

    private School $school;
    private User $user;
    private Student $student;
    private AcademicYear $academicYear;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup base tenant and related data
        $this->school = School::create([
            'name' => 'Horizon Test Academy',
            'slug' => 'horizon-test',
        ]);

        $this->user = User::create([
            'school_id' => $this->school->id,
            'name' => 'John Doe',
            'email' => 'john.doe@test.com',
            'password' => bcrypt('password123'),
        ]);

        $this->student = Student::create([
            'school_id' => $this->school->id,
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'registration_number' => 'REG-1001',
            'admission_number' => 'ADM-1001',
            'gender' => 'female',
            'date_of_birth' => '2012-05-15',
            'admission_date' => '2026-01-10',
            'status' => 'active',
        ]);

        $this->academicYear = AcademicYear::create([
            'school_id' => $this->school->id,
            'title' => '2026 Academic Year',
            'starts_on' => '2026-01-01',
            'ends_on' => '2026-12-31',
            'is_current' => true,
        ]);
    }

    public function test_saas_platform_models_and_relations(): void
    {
        $subscription = Subscription::create([
            'school_id' => $this->school->id,
            'plan' => 'standard',
            'billing_cycle' => 'monthly',
            'amount' => 150.00,
            'starts_at' => '2026-06-01',
            'ends_at' => '2026-06-30',
            'status' => 'active',
        ]);

        $ticket = SupportTicket::create([
            'school_id' => $this->school->id,
            'user_id' => $this->user->id,
            'subject' => 'Cannot log in via mobile app',
            'description' => 'I get a timeout error when calling the API.',
            'priority' => 'high',
            'status' => 'open',
        ]);

        $this->assertDatabaseHas('subscriptions', ['plan' => 'standard']);
        $this->assertDatabaseHas('support_tickets', ['subject' => 'Cannot log in via mobile app']);
        $this->assertEquals($this->school->id, $subscription->school->id);
        $this->assertEquals($this->user->id, $ticket->raiser->id);
    }

    public function test_staff_management_profiles_leaves_and_payrolls(): void
    {
        $staff = StaffProfile::create([
            'user_id' => $this->user->id,
            'school_id' => $this->school->id,
            'employee_number' => 'EMP-550',
            'job_title' => 'Senior Mathematics Teacher',
            'employment_type' => 'full_time',
            'join_date' => '2025-09-01',
            'basic_salary' => 2500.00,
        ]);

        $leave = LeaveRequest::create([
            'school_id' => $this->school->id,
            'staff_profile_id' => $staff->id,
            'leave_type' => 'sick',
            'starts_on' => '2026-06-10',
            'ends_on' => '2026-06-12',
            'days' => 3,
            'reason' => 'Medical recovery',
            'status' => 'pending',
        ]);

        $payroll = Payroll::create([
            'school_id' => $this->school->id,
            'staff_profile_id' => $staff->id,
            'pay_period_start' => '2026-05-01',
            'pay_period_end' => '2026-05-31',
            'basic_salary' => 2500.00,
            'allowances' => 200.00,
            'deductions' => 150.00,
            'net_pay' => 2550.00,
            'payment_status' => 'draft',
        ]);

        $this->assertDatabaseHas('staff_profiles', ['employee_number' => 'EMP-550']);
        $this->assertDatabaseHas('leave_requests', ['days' => 3]);
        $this->assertDatabaseHas('payrolls', ['net_pay' => 2550.00]);

        $this->assertEquals($staff->id, $this->user->fresh()->staffProfile->id);
        $this->assertEquals($staff->id, $leave->staffProfile->id);
        $this->assertEquals($staff->id, $payroll->staffProfile->id);
    }

    public function test_library_book_borrowing_triggers_available_copies(): void
    {
        // 1. Create a Book
        $book = Book::create([
            'school_id' => $this->school->id,
            'title' => 'Introduction to Algorithms',
            'author' => 'CLRS',
            'isbn' => '9780262033848',
            'total_copies' => 5,
            'available_copies' => 5,
        ]);

        $this->assertEquals(5, $book->available_copies);

        // 2. Borrow the Book (creates borrowing entry, triggers decrement)
        $borrowing = BookBorrowing::create([
            'school_id' => $this->school->id,
            'book_id' => $book->id,
            'borrower_type' => Student::class,
            'borrower_id' => $this->student->id,
            'issued_by' => $this->user->id,
            'issued_on' => '2026-06-09',
            'due_on' => '2026-06-23',
            'status' => 'active',
        ]);

        // Assert availability decremented to 4
        $this->assertEquals(4, $book->fresh()->available_copies);

        // 3. Return the Book (updates borrowing entry, triggers increment)
        $borrowing->update([
            'returned_on' => '2026-06-15',
            'status' => 'returned',
        ]);

        // Assert availability incremented back to 5
        $this->assertEquals(5, $book->fresh()->available_copies);

        // Assert polymorphic relation from student's side
        $this->assertEquals(1, $this->student->borrowings()->count());
        $this->assertEquals($book->id, $this->student->borrowings->first()->book_id);
    }

    public function test_hostel_room_and_allocation(): void
    {
        $room = HostelRoom::create([
            'school_id' => $this->school->id,
            'room_number' => 'Room 101',
            'block' => 'A Block',
            'gender' => 'female',
            'capacity' => 4,
            'floor' => 1,
        ]);

        $allocation = HostelAllocation::create([
            'school_id' => $this->school->id,
            'hostel_room_id' => $room->id,
            'student_id' => $this->student->id,
            'academic_year_id' => $this->academicYear->id,
            'starts_on' => '2026-01-15',
            'is_current' => true,
            'allocated_by' => $this->user->id,
        ]);

        $this->assertDatabaseHas('hostel_rooms', ['room_number' => 'Room 101']);
        $this->assertDatabaseHas('hostel_allocations', ['student_id' => $this->student->id]);
        $this->assertEquals($room->id, $this->student->hostelAllocations->first()->hostel_room_id);
    }

    public function test_transportation_fleet_routes_and_students(): void
    {
        $vehicle = Vehicle::create([
            'school_id' => $this->school->id,
            'registration' => 'MJ 1002',
            'make' => 'Toyota',
            'model' => 'Coaster',
            'capacity' => 30,
            'driver_name' => 'Bus Driver Steve',
            'status' => 'active',
        ]);

        $route = TransportRoute::create([
            'school_id' => $this->school->id,
            'vehicle_id' => $vehicle->id,
            'name' => 'Blantyre City Route',
            'direction' => 'both',
            'pickup_points' => [
                ['name' => 'Chilomoni Gate', 'time' => '06:45'],
                ['name' => 'Namiwawa Stop', 'time' => '07:05'],
            ],
        ]);

        $studentTransport = StudentTransport::create([
            'school_id' => $this->school->id,
            'student_id' => $this->student->id,
            'transport_route_id' => $route->id,
            'academic_year_id' => $this->academicYear->id,
            'pickup_point' => 'Namiwawa Stop',
        ]);

        $this->assertDatabaseHas('vehicles', ['registration' => 'MJ 1002']);
        $this->assertDatabaseHas('student_transports', ['pickup_point' => 'Namiwawa Stop']);

        $retrievedRoute = TransportRoute::find($route->id);
        $this->assertIsArray($retrievedRoute->pickup_points);
        $this->assertEquals('Chilomoni Gate', $retrievedRoute->pickup_points[0]['name']);
        $this->assertEquals($route->id, $this->student->studentTransports->first()->transport_route_id);
    }
}
