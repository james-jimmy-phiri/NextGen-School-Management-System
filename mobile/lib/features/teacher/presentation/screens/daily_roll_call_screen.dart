import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../../../shared/widgets/user_avatar.dart';
import '../../data/models/teacher_models.dart';
import '../../data/teacher_workspace_repository.dart';
import '../../state/teacher_workspace_state.dart';

class DailyRollCallScreen extends ConsumerStatefulWidget {
  final TeacherClassModel classGroup;

  const DailyRollCallScreen({
    super.key,
    required this.classGroup,
  });

  @override
  ConsumerState<DailyRollCallScreen> createState() => _DailyRollCallScreenState();
}

class _DailyRollCallScreenState extends ConsumerState<DailyRollCallScreen> {
  String _searchQuery = '';
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    // Pre-select the class in the state
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(selectedTeacherClassProvider.notifier).state = widget.classGroup;
    });
  }

  void _onSaveRegister() async {
    setState(() => _isSaving = true);
    final sessionType = ref.read(selectedSessionTypeProvider);

    final result = await ref
        .read(attendanceRollProvider.notifier)
        .saveRegister(sessionType: sessionType);

    if (mounted) {
      setState(() => _isSaving = false);

      // Refresh pending sync counter
      ref.read(offlineSyncCountProvider.notifier).state =
          ref.read(teacherWorkspaceRepositoryProvider).getPendingSyncCount();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              Icon(
                result.syncedOnline ? Icons.cloud_done : Icons.cloud_off,
                color: Colors.white,
                size: 20,
              ),
              const SizedBox(width: 10),
              Expanded(child: Text(result.message)),
            ],
          ),
          backgroundColor: result.syncedOnline ? AppTheme.success : const Color(0xFFD97706),
          duration: const Duration(seconds: 3),
        ),
      );

      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final rosterAsync = ref.watch(attendanceRollProvider);
    final selectedDate = ref.watch(selectedAttendanceDateProvider);
    final sessionType = ref.watch(selectedSessionTypeProvider);

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${widget.classGroup.name} Roll Call',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            Text(
              '${selectedDate.toIso8601String().split('T').first} · ${sessionType.toUpperCase()}',
              style: const TextStyle(fontSize: 11, color: AppTheme.textMutedLight),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_month),
            onPressed: () async {
              final picked = await showDatePicker(
                context: context,
                initialDate: selectedDate,
                firstDate: DateTime.now().subtract(const Duration(days: 30)),
                lastDate: DateTime.now().add(const Duration(days: 7)),
              );
              if (picked != null) {
                ref.read(selectedAttendanceDateProvider.notifier).state = picked;
              }
            },
          ),
        ],
      ),
      body: rosterAsync.when(
        data: (students) {
          final filtered = students.where((s) {
            if (_searchQuery.isEmpty) return true;
            final q = _searchQuery.toLowerCase();
            return s.name.toLowerCase().contains(q) ||
                s.admissionNumber.toLowerCase().contains(q);
          }).toList();

          final presentCount = students.where((s) => s.status == 'present').length;
          final lateCount = students.where((s) => s.status == 'late').length;
          final absentCount = students.where((s) => s.status == 'absent').length;
          final excusedCount = students.where((s) => s.status == 'excused').length;

          return Column(
            children: [
              // ─── Controls & Search Bar ─────────────────────────────────────
              Container(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                color: Colors.white,
                child: Column(
                  children: [
                    Row(
                      children: [
                        // Session Selector (Morning / Afternoon)
                        SegmentedButton<String>(
                          segments: const [
                            ButtonSegment(value: 'morning', label: Text('Morning')),
                            ButtonSegment(value: 'afternoon', label: Text('Afternoon')),
                          ],
                          selected: {sessionType},
                          onSelectionChanged: (set) {
                            ref.read(selectedSessionTypeProvider.notifier).state = set.first;
                          },
                        ),
                        const Spacer(),
                        // Fast One-Tap "Mark All Present"
                        OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppTheme.success,
                            side: const BorderSide(color: AppTheme.success),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          ),
                          icon: const Icon(Icons.done_all, size: 16),
                          label: const Text('All Present', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          onPressed: () {
                            ref.read(attendanceRollProvider.notifier).markAll('present');
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      onChanged: (val) => setState(() => _searchQuery = val),
                      decoration: InputDecoration(
                        hintText: 'Search by student name or admission number...',
                        isDense: true,
                        prefixIcon: const Icon(Icons.search, size: 18),
                        suffixIcon: _searchQuery.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.clear, size: 16),
                                onPressed: () => setState(() => _searchQuery = ''),
                              )
                            : null,
                      ),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),

              // ─── Students Roster List ───────────────────────────────────────
              Expanded(
                child: filtered.isEmpty
                    ? Center(
                        child: Text(
                          _searchQuery.isEmpty
                              ? 'No students enrolled in this class.'
                              : 'No students matching "$_searchQuery".',
                          style: const TextStyle(color: AppTheme.textMutedLight),
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.fromLTRB(16, 12, 16, 80),
                        itemCount: filtered.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 8),
                        itemBuilder: (context, index) {
                          final student = filtered[index];
                          return _StudentRollTile(
                            student: student,
                            onStatusChanged: (newStatus) {
                              ref
                                  .read(attendanceRollProvider.notifier)
                                  .setStatus(student.id, newStatus);
                            },
                            onNotesChanged: (notes) {
                              ref
                                  .read(attendanceRollProvider.notifier)
                                  .setNotes(student.id, notes);
                            },
                          );
                        },
                      ),
              ),

              // ─── Bottom Tally & Save Register Bar ───────────────────────────
              Container(
                padding: const EdgeInsets.fromLTRB(18, 12, 18, 16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: const Border(top: BorderSide(color: AppTheme.borderLight)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 10,
                      offset: const Offset(0, -3),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            children: [
                              _TallyDot(color: AppTheme.success, label: '$presentCount P'),
                              const SizedBox(width: 8),
                              _TallyDot(color: AppTheme.warning, label: '$lateCount L'),
                              const SizedBox(width: 8),
                              _TallyDot(color: AppTheme.error, label: '$absentCount A'),
                              const SizedBox(width: 8),
                              _TallyDot(color: Colors.blueGrey, label: '$excusedCount E'),
                            ],
                          ),
                          const SizedBox(height: 3),
                          Text(
                            '${students.length} Total Enrolled Learners',
                            style: const TextStyle(fontSize: 11, color: AppTheme.textMutedLight),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    AppButton(
                      text: 'Save Register',
                      isLoading: _isSaving,
                      icon: Icons.save_outlined,
                      color: AppTheme.primary,
                      onPressed: _onSaveRegister,
                    ),
                  ],
                ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 48, color: AppTheme.error),
                const SizedBox(height: 12),
                Text('Could not load student roster: $err', textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.read(attendanceRollProvider.notifier).loadRoster(),
                  child: const Text('Try Again'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _StudentRollTile extends StatelessWidget {
  final RosterStudentModel student;
  final ValueChanged<String> onStatusChanged;
  final ValueChanged<String> onNotesChanged;

  const _StudentRollTile({
    required this.student,
    required this.onStatusChanged,
    required this.onNotesChanged,
  });

  @override
  Widget build(BuildContext context) {
    final status = student.status ?? 'present';

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: BorderSide(
          color: status == 'absent'
              ? AppTheme.error.withValues(alpha: 0.5)
              : (status == 'late' ? AppTheme.warning.withValues(alpha: 0.5) : AppTheme.borderLight),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Row(
          children: [
            UserAvatar(
              name: student.name,
              initials: student.initials,
              radius: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    student.name,
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Text(
                        student.admissionNumber,
                        style: const TextStyle(fontSize: 11, color: AppTheme.textMutedLight),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                        decoration: BoxDecoration(
                          color: AppTheme.borderLight,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'Stream ${student.streamName}',
                          style: const TextStyle(fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Quick 4-Way Status Toggle Buttons: P, L, A, E
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _StatusButton(
                  letter: 'P',
                  isSelected: status == 'present',
                  activeColor: AppTheme.success,
                  onTap: () => onStatusChanged('present'),
                ),
                const SizedBox(width: 4),
                _StatusButton(
                  letter: 'L',
                  isSelected: status == 'late',
                  activeColor: AppTheme.warning,
                  onTap: () => onStatusChanged('late'),
                ),
                const SizedBox(width: 4),
                _StatusButton(
                  letter: 'A',
                  isSelected: status == 'absent',
                  activeColor: AppTheme.error,
                  onTap: () => onStatusChanged('absent'),
                ),
                const SizedBox(width: 4),
                _StatusButton(
                  letter: 'E',
                  isSelected: status == 'excused',
                  activeColor: Colors.blueGrey,
                  onTap: () => onStatusChanged('excused'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _StatusButton extends StatelessWidget {
  final String letter;
  final bool isSelected;
  final Color activeColor;
  final VoidCallback onTap;

  const _StatusButton({
    required this.letter,
    required this.isSelected,
    required this.activeColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          color: isSelected ? activeColor : const Color(0xFFF1F5F9),
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isSelected ? activeColor : AppTheme.borderLight,
          ),
        ),
        alignment: Alignment.center,
        child: Text(
          letter,
          style: TextStyle(
            fontWeight: FontWeight.w900,
            fontSize: 13,
            color: isSelected ? Colors.white : AppTheme.textMutedLight,
          ),
        ),
      ),
    );
  }
}

class _TallyDot extends StatelessWidget {
  final Color color;
  final String label;

  const _TallyDot({required this.color, required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: color),
      ),
    );
  }
}

