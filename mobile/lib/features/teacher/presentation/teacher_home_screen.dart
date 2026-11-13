import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/floating_bottom_dock.dart';
import '../../../shared/widgets/user_avatar.dart';
import '../../auth/state/auth_state.dart';
import '../../communication/presentation/screens/announcements_screen.dart';
import '../../communication/presentation/screens/messages_inbox_screen.dart';
import '../../communication/presentation/screens/school_calendar_screen.dart';
import '../../communication/state/communication_state.dart';
import '../../navigation/presentation/app_nav_drawer.dart';
import '../data/models/teacher_models.dart';
import '../data/teacher_workspace_repository.dart';
import '../state/teacher_workspace_state.dart';
import 'screens/daily_roll_call_screen.dart';
import 'screens/teacher_marks_screen.dart';
import 'screens/teacher_timetable_screen.dart';

class TeacherHomeScreen extends ConsumerStatefulWidget {
  const TeacherHomeScreen({super.key});

  @override
  ConsumerState<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends ConsumerState<TeacherHomeScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  int _activeDockIndex = 0;
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Daily Roll-Call',
    'Marks Entry',
    'Timetable',
    'Circulars',
    'Messages',
  ];

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;
    final classesAsync = ref.watch(teacherClassesProvider);
    final pendingSync = ref.watch(offlineSyncCountProvider);
    final unreadMessages = ref.watch(unreadMessagesCountProvider);

    return Scaffold(
      key: _scaffoldKey,
      drawer: const AppNavDrawer(),
      extendBody: true,
      bottomNavigationBar: FloatingBottomDock(
        activeIndex: _activeDockIndex,
        unreadMessages: unreadMessages,
        onIndexChanged: (index) {
          setState(() => _activeDockIndex = index);
          if (index == 1) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const TeacherTimetableScreen()),
            );
          } else if (index == 2) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const TeacherMarksScreen()),
            );
          } else if (index == 3) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const MessagesInboxScreen()),
            );
          }
        },
        onMenuTap: () => _scaffoldKey.currentState?.openDrawer(),
      ),
      body: SafeArea(
        bottom: false,
        child: RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(teacherClassesProvider);
            ref.read(offlineSyncCountProvider.notifier).state =
                ref.read(teacherWorkspaceRepositoryProvider).getPendingSyncCount();
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(20, 16, 20, 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ─── Top Bar (Matching Inspiration 76630efe2e8f58715e5234efa0876ae8.webp) ───
                Row(
                  children: [
                    Stack(
                      children: [
                        UserAvatar(
                          name: user?.name ?? 'Teacher',
                          initials: user?.avatarInitials ?? 'T',
                          radius: 24,
                        ),
                        Positioned(
                          right: 0,
                          bottom: 0,
                          child: Container(
                            height: 12,
                            width: 12,
                            decoration: BoxDecoration(
                              color: const Color(0xFF22C55E),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hello, ${user?.name.split(' ')[0] ?? 'Educator'}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textMainLight,
                            ),
                          ),
                          Text(
                            user?.school?.name ?? 'Sunrise Academy • Faculty',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppTheme.textMutedLight,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Direct Chat Action
                    Stack(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.chat_bubble_outline_rounded, size: 24),
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const MessagesInboxScreen()),
                            );
                          },
                        ),
                        if (unreadMessages > 0)
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Container(
                              height: 8,
                              width: 8,
                              decoration: const BoxDecoration(
                                color: Color(0xFFEF4444),
                                shape: BoxShape.circle,
                              ),
                            ),
                          ),
                      ],
                    ),
                    // Notification Bell Action
                    IconButton(
                      icon: const Icon(Icons.notifications_none_rounded, size: 26),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const AnnouncementsScreen()),
                        );
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 18),

                // ─── Search Capsule (Matching Inspiration) ────────────────────
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.search, color: Colors.grey.shade500, size: 20),
                      const SizedBox(width: 10),
                      Text(
                        'Search classes, roster students, subjects...',
                        style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // ─── Hero Highlight Cards (Lime/Neon Accent from Inspiration) ───
                Row(
                  children: [
                    // Left: Classes Assigned
                    Expanded(
                      child: InkWell(
                        onTap: () {
                          ref.invalidate(teacherClassesProvider);
                        },
                        borderRadius: BorderRadius.circular(24),
                        child: Container(
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE2F952), // Vibrant Lime
                            borderRadius: BorderRadius.circular(24),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    classesAsync.maybeWhen(
                                      data: (cls) => '${cls.length} Class${cls.length == 1 ? '' : 'es'}',
                                      orElse: () => 'Classes',
                                    ),
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w900,
                                      color: Colors.black,
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: const BoxDecoration(
                                      color: Colors.black,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.chevron_right, color: Colors.white, size: 16),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Active Cohorts',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.black87,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),

                    // Right: Marks / Grading Shortcut
                    Expanded(
                      child: InkWell(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const TeacherMarksScreen()),
                          );
                        },
                        borderRadius: BorderRadius.circular(24),
                        child: Container(
                          padding: const EdgeInsets.all(18),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE2F952), // Vibrant Lime
                            borderRadius: BorderRadius.circular(24),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Marks Entry',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.w900,
                                      color: Colors.black,
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: const BoxDecoration(
                                      color: Colors.black,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.chevron_right, color: Colors.white, size: 16),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Continuous Tests',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.black87,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 22),

                // ─── Category Capsule Pills (Horizontal Scrollable) ─────────
                SizedBox(
                  height: 38,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categories.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 8),
                    itemBuilder: (context, idx) {
                      final cat = _categories[idx];
                      final isSelected = _selectedCategory == cat;

                      return InkWell(
                        onTap: () {
                          setState(() => _selectedCategory = cat);
                          if (cat == 'Marks Entry') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const TeacherMarksScreen()),
                            );
                          } else if (cat == 'Timetable') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const TeacherTimetableScreen()),
                            );
                          } else if (cat == 'Circulars') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const AnnouncementsScreen()),
                            );
                          } else if (cat == 'Messages') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const MessagesInboxScreen()),
                            );
                          }
                        },
                        borderRadius: BorderRadius.circular(20),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0xFF0F172A) : Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected ? const Color(0xFF0F172A) : Colors.grey.shade300,
                            ),
                          ),
                          child: Text(
                            cat,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: isSelected ? Colors.white : Colors.black87,
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 22),

                // ─── Offline Queue Status & Sync Banner ──────────────────────────
                if (pendingSync > 0)
                  Container(
                    margin: const EdgeInsets.only(bottom: 20),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFFDE68A)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: const BoxDecoration(
                            color: Color(0xFFFDE68A),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.cloud_upload_outlined, color: Color(0xFFB45309), size: 22),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '$pendingSync Offline Roll-Call${pendingSync > 1 ? 's' : ''} Queued',
                                style: const TextStyle(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 14,
                                  color: Color(0xFF92400E),
                                ),
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                'Saved locally in Hive storage. Tap to sync now.',
                                style: TextStyle(fontSize: 12, color: Color(0xFFB45309)),
                              ),
                            ],
                          ),
                        ),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFB45309),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          ),
                          onPressed: () async {
                            final repo = ref.read(teacherWorkspaceRepositoryProvider);
                            final result = await repo.syncPendingAttendance();
                            ref.read(offlineSyncCountProvider.notifier).state = repo.getPendingSyncCount();

                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Synced ${result.synced} sessions successfully!'),
                                  backgroundColor: AppTheme.success,
                                ),
                              );
                            }
                          },
                          child: const Text('Sync Now', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                  ),

                // ─── Assigned Classes & Daily Roll Call ──────────────────────────
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'My Classes & Daily Roll Call',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textMainLight,
                      ),
                    ),
                    TextButton(
                      onPressed: () => ref.refresh(teacherClassesProvider),
                      child: const Text('Refresh', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                classesAsync.when(
                  data: (classes) {
                    if (classes.isEmpty) {
                      return const Card(
                        child: Padding(
                          padding: EdgeInsets.all(20),
                          child: Text('No classes currently assigned to your teacher profile.'),
                        ),
                      );
                    }

                    return Column(
                      children: classes.map((c) => _ClassAttendanceCard(classGroup: c)).toList(),
                    );
                  },
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 30),
                      child: CircularProgressIndicator(),
                    ),
                  ),
                  error: (err, _) => Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text('Could not load classes: $err'),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // ─── Operations Shortcuts ────────────────────────────────────────
                const Text(
                  'Teacher Operations',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textMainLight,
                  ),
                ),
                const SizedBox(height: 12),

                Row(
                  children: [
                    Expanded(
                      child: _FeatureCard(
                        icon: Icons.edit_document,
                        color: const Color(0xFF4338CA),
                        title: 'Continuous Marks',
                        subtitle: 'Assessments & tests',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const TeacherMarksScreen()),
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _FeatureCard(
                        icon: Icons.calendar_month,
                        color: const Color(0xFF0284C7),
                        title: 'Teaching Schedule',
                        subtitle: 'Periods & rooms',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const TeacherTimetableScreen()),
                          );
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _FeatureCard(
                        icon: Icons.event_note,
                        color: const Color(0xFF0D9488),
                        title: 'Term Calendar',
                        subtitle: 'Events & holidays',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const SchoolCalendarScreen()),
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _FeatureCard(
                        icon: Icons.forum_outlined,
                        color: const Color(0xFFD97706),
                        title: 'Parent Messages',
                        subtitle: 'Direct inquiries',
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const MessagesInboxScreen()),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _ClassAttendanceCard extends StatelessWidget {
  final TeacherClassModel classGroup;

  const _ClassAttendanceCard({required this.classGroup});

  @override
  Widget build(BuildContext context) {
    final isMarked = classGroup.isAttendanceMarkedToday;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: isMarked
                    ? const Color(0xFFDCFCE7)
                    : const Color(0xFFFEF3C7),
                child: Icon(
                  isMarked ? Icons.check_circle : Icons.pending_actions,
                  color: isMarked ? const Color(0xFF16A34A) : const Color(0xFFD97706),
                  size: 24,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      classGroup.name,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${classGroup.enrolledCount} Learners · Room ${classGroup.roomNumber}',
                      style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isMarked
                      ? const Color(0xFFDCFCE7)
                      : const Color(0xFFFEF3C7),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  isMarked ? 'Completed' : 'Pending',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: isMarked ? const Color(0xFF16A34A) : const Color(0xFFD97706),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              icon: Icon(isMarked ? Icons.edit : Icons.fact_check, size: 16),
              label: Text(isMarked ? 'Update Attendance Register' : 'Start Daily Roll Call'),
              style: ElevatedButton.styleFrom(
                backgroundColor: isMarked ? Colors.grey.shade800 : const Color(0xFF0F172A),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => DailyRollCallScreen(classGroup: classGroup),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _FeatureCard({
    required this.icon,
    required this.color,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.03),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: color.withValues(alpha: 0.12),
              child: Icon(icon, color: color, size: 20),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textMainLight),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: AppTheme.textMutedLight),
            ),
          ],
        ),
      ),
    );
  }
}
