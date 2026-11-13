import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../state/teacher_workspace_state.dart';

class TeacherTimetableScreen extends ConsumerStatefulWidget {
  const TeacherTimetableScreen({super.key});

  @override
  ConsumerState<TeacherTimetableScreen> createState() => _TeacherTimetableScreenState();
}

class _TeacherTimetableScreenState extends ConsumerState<TeacherTimetableScreen> {
  String _selectedDay = 'Monday';
  final List<String> _days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  @override
  Widget build(BuildContext context) {
    final timetableAsync = ref.watch(teacherTimetableProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Teaching Schedule', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            Text('Assigned Cohorts & Classrooms', style: TextStyle(fontSize: 11, color: AppTheme.textMutedLight)),
          ],
        ),
      ),
      body: timetableAsync.when(
        data: (slots) {
          final daySlots = slots.where((s) {
            final day = (s['day'] ?? s['day_of_week'] ?? '').toString();
            return day.toLowerCase() == _selectedDay.toLowerCase();
          }).toList();

          return Column(
            children: [
              Container(
                color: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: _days.map((d) {
                      final isSelected = d == _selectedDay;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ChoiceChip(
                          label: Text(d),
                          selected: isSelected,
                          onSelected: (_) => setState(() => _selectedDay = d),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
              const Divider(height: 1),
              Expanded(
                child: daySlots.isEmpty
                    ? Center(
                        child: Text(
                          'No teaching periods scheduled on $_selectedDay.',
                          style: const TextStyle(color: AppTheme.textMutedLight),
                        ),
                      )
                    : ListView.separated(
                        padding: const EdgeInsets.all(18),
                        itemCount: daySlots.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 10),
                        itemBuilder: (context, index) {
                          final slot = daySlots[index];
                          return Card(
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                              side: const BorderSide(color: AppTheme.borderLight),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: AppTheme.primaryLight.withValues(alpha: 0.12),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: const Icon(Icons.school, color: AppTheme.primary, size: 20),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          (slot['subject'] ?? 'Subject').toString(),
                                          style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          '${slot['class'] ?? 'Form 3 · Stream A'} · ${slot['room'] ?? 'Room 12B'}',
                                          style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: AppTheme.borderLight,
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      (slot['time'] ?? '08:00 - 09:20').toString(),
                                      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Could not load timetable: $err')),
      ),
    );
  }
}

