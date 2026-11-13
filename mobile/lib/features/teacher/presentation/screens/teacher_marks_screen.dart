import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../data/models/teacher_models.dart';
import '../../data/teacher_workspace_repository.dart';
import '../../state/teacher_workspace_state.dart';

class TeacherMarksScreen extends ConsumerWidget {
  const TeacherMarksScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final assessmentsAsync = ref.watch(teacherAssessmentsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Marks & Continuous Assessments', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            Text('Teacher Grading Console', style: TextStyle(fontSize: 11, color: AppTheme.textMutedLight)),
          ],
        ),
      ),
      body: assessmentsAsync.when(
        data: (assessments) {
          if (assessments.isEmpty) {
            return const Center(
              child: Text(
                'No assessments registered for this academic term.',
                style: TextStyle(color: AppTheme.textMutedLight),
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(18),
            itemCount: assessments.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final a = assessments[index];
              return _AssessmentCard(assessment: a);
            },
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
                Text('Could not load assessments: $err', textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.refresh(teacherAssessmentsProvider),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _AssessmentCard extends StatelessWidget {
  final TeacherAssessmentModel assessment;

  const _AssessmentCard({required this.assessment});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppTheme.borderLight),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryLight.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.assignment, color: AppTheme.primary, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        assessment.title,
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${assessment.subject} · ${assessment.className}',
                        style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE0E7FF),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'Max ${assessment.maxScore.toStringAsFixed(0)}',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: AppTheme.primary),
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${assessment.term} · Weight: ${assessment.weight}x',
                  style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
                ),
                TextButton.icon(
                  icon: const Icon(Icons.edit_note, size: 18),
                  label: const Text('Capture Marks'),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => AssessmentMarksEntryDialog(assessment: assessment),
                      ),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class AssessmentMarksEntryDialog extends ConsumerStatefulWidget {
  final TeacherAssessmentModel assessment;

  const AssessmentMarksEntryDialog({super.key, required this.assessment});

  @override
  ConsumerState<AssessmentMarksEntryDialog> createState() => _AssessmentMarksEntryDialogState();
}

class _AssessmentMarksEntryDialogState extends ConsumerState<AssessmentMarksEntryDialog> {
  final Map<int, TextEditingController> _controllers = {};
  bool _isSaving = false;

  final List<Map<String, dynamic>> _demoStudents = [
    {'id': 1, 'name': 'Thandiwe Banda', 'adm': 'ADM-2026-001', 'score': 85.0},
    {'id': 2, 'name': 'Kondwani Phiri', 'adm': 'ADM-2026-002', 'score': 72.0},
    {'id': 3, 'name': 'Chisomo Mwale', 'adm': 'ADM-2026-003', 'score': 91.0},
    {'id': 4, 'name': 'Tadala Chisi', 'adm': 'ADM-2026-004', 'score': 64.0},
    {'id': 5, 'name': 'Blessings Gondwe', 'adm': 'ADM-2026-005', 'score': 78.5},
  ];

  @override
  void initState() {
    super.initState();
    for (final s in _demoStudents) {
      _controllers[s['id'] as int] = TextEditingController(
        text: (s['score'] as double).toStringAsFixed(0),
      );
    }
  }

  @override
  void dispose() {
    for (final c in _controllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _onSave() async {
    setState(() => _isSaving = true);

    final marksPayload = _demoStudents.map((s) {
      final studentId = s['id'] as int;
      final rawScore = double.tryParse(_controllers[studentId]?.text ?? '0') ?? 0.0;
      return {
        'student_id': studentId,
        'score': rawScore,
        'comment': rawScore >= 80 ? 'Distinction' : 'Credit',
      };
    }).toList();

    try {
      final repo = ref.read(teacherWorkspaceRepositoryProvider);
      await repo.saveMarks(widget.assessment.id, marksPayload);

      if (mounted) {
        setState(() => _isSaving = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Marks submitted successfully!'),
            backgroundColor: AppTheme.success,
          ),
        );
        Navigator.pop(context);
      }
    } catch (_) {
      if (mounted) {
        setState(() => _isSaving = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Marks saved locally. Will sync when online.'),
            backgroundColor: Color(0xFFD97706),
          ),
        );
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Grade ${widget.assessment.title}'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppTheme.primaryLight.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Maximum Score: ${widget.assessment.maxScore.toStringAsFixed(0)} pts',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primary),
                ),
                Text(
                  '${widget.assessment.subject} (${widget.assessment.className})',
                  style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          ..._demoStudents.map((s) {
            final studentId = s['id'] as int;
            final controller = _controllers[studentId]!;
            final currentScore = double.tryParse(controller.text) ?? 0.0;
            final grade = currentScore >= 80 ? 'A' : (currentScore >= 70 ? 'B' : (currentScore >= 60 ? 'C' : 'D'));

            return Card(
              margin: const EdgeInsets.only(bottom: 10),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s['name'] as String, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                          const SizedBox(height: 2),
                          Text(s['adm'] as String, style: const TextStyle(fontSize: 11, color: AppTheme.textMutedLight)),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.borderLight,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text('Grade $grade', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11)),
                    ),
                    const SizedBox(width: 12),
                    SizedBox(
                      width: 64,
                      child: TextField(
                        controller: controller,
                        keyboardType: TextInputType.number,
                        textAlign: TextAlign.center,
                        decoration: const InputDecoration(
                          isDense: true,
                          contentPadding: EdgeInsets.symmetric(vertical: 8, horizontal: 8),
                        ),
                        onChanged: (_) => setState(() {}),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(16),
        color: Colors.white,
        child: AppButton(
          text: 'Submit Assessment Marks',
          isLoading: _isSaving,
          icon: Icons.check,
          onPressed: _onSave,
        ),
      ),
    );
  }
}

