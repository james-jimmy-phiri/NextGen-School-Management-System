import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/models/child_academics_model.dart';
import '../data/models/child_attendance_model.dart';
import '../data/models/child_fees_model.dart';
import '../data/models/child_model.dart';
import '../data/models/child_timetable_model.dart';
import '../data/parent_portal_repository.dart';

/// Currently selected child index in the Multi-Child Switcher
final selectedChildIndexProvider = StateProvider<int>((ref) => 0);

/// List of all children linked to the authenticated guardian
final parentChildrenProvider =
    AsyncNotifierProvider<ParentChildrenNotifier, List<ChildModel>>(
  ParentChildrenNotifier.new,
);

class ParentChildrenNotifier extends AsyncNotifier<List<ChildModel>> {
  @override
  Future<List<ChildModel>> build() async {
    final repository = ref.watch(parentPortalRepositoryProvider);
    return repository.getChildren();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(parentPortalRepositoryProvider);
      return repository.getChildren();
    });
  }
}

/// The actively focused child in the dashboard
final selectedChildProvider = Provider<ChildModel?>((ref) {
  final childrenAsync = ref.watch(parentChildrenProvider);
  final selectedIndex = ref.watch(selectedChildIndexProvider);

  return childrenAsync.when(
    data: (children) {
      if (children.isEmpty) return null;
      if (selectedIndex >= children.length) {
        return children.first;
      }
      return children[selectedIndex];
    },
    loading: () => null,
    error: (_, __) => null,
  );
});

/// Attendance records & statistics provider for a specific child
final childAttendanceProvider =
    FutureProvider.family<ChildAttendanceData, int>((ref, studentId) async {
  final repository = ref.watch(parentPortalRepositoryProvider);
  return repository.getChildAttendance(studentId);
});

/// Academic marks & subjects provider for a specific child
final childAcademicsProvider =
    FutureProvider.family<ChildAcademicsData, int>((ref, studentId) async {
  final repository = ref.watch(parentPortalRepositoryProvider);
  return repository.getChildAcademics(studentId);
});

/// Fees, invoices, and payments provider for a specific child
final childFeesProvider =
    FutureProvider.family<ChildFeesData, int>((ref, studentId) async {
  final repository = ref.watch(parentPortalRepositoryProvider);
  return repository.getChildFees(studentId);
});

/// Timetable schedule provider for a specific child
final childTimetableProvider =
    FutureProvider.family<ChildTimetableData, int>((ref, studentId) async {
  final repository = ref.watch(parentPortalRepositoryProvider);
  return repository.getChildTimetable(studentId);
});

