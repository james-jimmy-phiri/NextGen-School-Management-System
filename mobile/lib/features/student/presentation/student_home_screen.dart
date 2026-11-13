import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/status_badge.dart';
import '../../auth/state/auth_state.dart';
import '../../navigation/presentation/app_nav_drawer.dart';

class StudentHomeScreen extends ConsumerWidget {
  const StudentHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              user?.school?.name ?? 'Sunrise Academy',
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            ),
            const Text(
              'Learner Portal',
              style: TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
            ),
          ],
        ),
      ),
      drawer: const AppNavDrawer(),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0284C7), Color(0xFF38BDF8)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const StatusBadge(
                    label: 'Student Learner',
                    color: Colors.white,
                    backgroundColor: Color(0x33FFFFFF),
                    icon: Icons.school,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Welcome, ${user?.name ?? 'Learner'}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Check your class timetable, continuous assessment marks, and announcements.',
                    style: TextStyle(color: Color(0xEEFFFFFF), fontSize: 13),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'My Timetable Today',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 12),
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Text('Timetable schedule will populate from the school academic calendar.'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

