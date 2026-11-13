import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/teacher_models.dart';
import '../data/teacher_workspace_repository.dart';

/// Assigned teaching classes
final teacherClassesProvider = FutureProvider<List<TeacherClassModel>>((ref) async {
  final repository = ref.watch(teacherWorkspaceRepositoryProvider);
  return repository.getClasses();
});

/// Currently selected class group for roll call or marks
final selectedTeacherClassProvider = StateProvider<TeacherClassModel?>((ref) => null);

/// Selected date for attendance (defaults to Today)
final selectedAttendanceDateProvider = StateProvider<DateTime>((ref) => DateTime.now());

/// Selected session type ('morning' or 'afternoon')
final selectedSessionTypeProvider = StateProvider<String>((ref) => 'morning');

/// Pending offline sync sessions count
final offlineSyncCountProvider = StateProvider<int>((ref) {
  final repo = ref.watch(teacherWorkspaceRepositoryProvider);
  return repo.getPendingSyncCount();
});

/// Attendance Roll-Call Manager for the active class & date
final attendanceRollProvider =
    StateNotifierProvider.autoDispose<AttendanceRollNotifier, AsyncValue<List<RosterStudentModel>>>(
  (ref) {
    final repo = ref.watch(teacherWorkspaceRepositoryProvider);
    final selectedClass = ref.watch(selectedTeacherClassProvider);
    final selectedDate = ref.watch(selectedAttendanceDateProvider);
    return AttendanceRollNotifier(repo, selectedClass, selectedDate);
  },
);

class AttendanceRollNotifier extends StateNotifier<AsyncValue<List<RosterStudentModel>>> {
  final TeacherWorkspaceRepository _repository;
  final TeacherClassModel? _classGroup;
  final DateTime _date;

  AttendanceRollNotifier(this._repository, this._classGroup, this._date)
      : super(const AsyncValue.loading()) {
    loadRoster();
  }

  Future<void> loadRoster() async {
    if (_classGroup == null) {
      state = const AsyncValue.data([]);
      return;
    }

    state = const AsyncValue.loading();
    try {
      final dateStr = _date.toIso8601String().split('T').first;
      final students = await _repository.getClassStudents(
        _classGroup.id,
        date: dateStr,
      );

      // Default status to 'present' if unmarked
      final initialized = students.map((s) {
        if (s.status == null) {
          return s.copyWith(status: 'present');
        }
        return s;
      }).toList();

      state = AsyncValue.data(initialized);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Change single student's status ('present', 'late', 'absent', 'excused')
  void setStatus(int studentId, String status) {
    state.whenData((students) {
      final updated = students.map((s) {
        if (s.id == studentId) {
          return s.copyWith(status: status);
        }
        return s;
      }).toList();
      state = AsyncValue.data(updated);
    });
  }

  /// Set notes for a student (e.g. sick, doctor visit, excused)
  void setNotes(int studentId, String notes) {
    state.whenData((students) {
      final updated = students.map((s) {
        if (s.id == studentId) {
          return s.copyWith(notes: notes);
        }
        return s;
      }).toList();
      state = AsyncValue.data(updated);
    });
  }

  /// Mark all students with a specific status (e.g. One-tap "Mark All Present")
  void markAll(String status) {
    state.whenData((students) {
      final updated = students.map((s) => s.copyWith(status: status)).toList();
      state = AsyncValue.data(updated);
    });
  }

  /// Save attendance register (Offline-First via Hive + Online Sync)
  Future<({bool syncedOnline, String message})> saveRegister({
    required String sessionType,
  }) async {
    final students = state.valueOrNull;
    if (_classGroup == null || students == null || students.isEmpty) {
      return (syncedOnline: false, message: 'No student records to save.');
    }

    final dateStr = _date.toIso8601String().split('T').first;

    // 1. Always save locally to Hive offline queue first
    await _repository.saveAttendanceLocally(
      classGroupId: _classGroup.id,
      date: dateStr,
      sessionType: sessionType,
      students: students,
    );

    // 2. Try online sync immediately
    try {
      await _repository.submitAttendanceDirectly(
        classGroupId: _classGroup.id,
        date: dateStr,
        sessionType: sessionType,
        students: students,
      );

      // If online succeeded, clear the offline queue entry
      await _repository.syncPendingAttendance();

      return (
        syncedOnline: true,
        message: 'Attendance register saved and synced with school servers.',
      );
    } catch (_) {
      // Network failed: saved offline in Hive
      return (
        syncedOnline: false,
        message: 'Saved offline. Record queued and will sync when internet restores.',
      );
    }
  }
}

/// Assessments list for teacher
final teacherAssessmentsProvider = FutureProvider<List<TeacherAssessmentModel>>((ref) async {
  final repo = ref.watch(teacherWorkspaceRepositoryProvider);
  return repo.getAssessments();
});

/// Teacher schedule timetable
final teacherTimetableProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  final repo = ref.watch(teacherWorkspaceRepositoryProvider);
  return repo.getTimetable();
});

