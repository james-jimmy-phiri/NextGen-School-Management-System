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
import '../state/parent_portal_state.dart';
import 'screens/child_academics_screen.dart';
import 'screens/child_attendance_screen.dart';
import 'screens/child_fees_screen.dart';
import 'screens/child_timetable_screen.dart';
import 'widgets/child_360_card.dart';
import 'widgets/child_switcher_bar.dart';

class ParentHomeScreen extends ConsumerStatefulWidget {
  const ParentHomeScreen({super.key});

  @override
  ConsumerState<ParentHomeScreen> createState() => _ParentHomeScreenState();
}

class _ParentHomeScreenState extends ConsumerState<ParentHomeScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  int _activeDockIndex = 0;
  String _selectedCategory = 'All';

  final List<String> _categories = [
    'All',
    'Attendance',
    'Academics',
    'Fees & Pay',
    'Timetable',
    'Events',
  ];

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;
    final childrenAsync = ref.watch(parentChildrenProvider);
    final activeChild = ref.watch(selectedChildProvider);
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
          if (activeChild == null) return;

          if (index == 1) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => ChildFeesScreen(child: activeChild)),
            );
          } else if (index == 2) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => ChildAcademicsScreen(child: activeChild)),
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
            await ref.read(parentChildrenProvider.notifier).refresh();
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
                          name: user?.name ?? 'Guardian',
                          initials: user?.avatarInitials ?? 'G',
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
                            'Hello, ${user?.name.split(' ')[0] ?? 'Guardian'}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textMainLight,
                            ),
                          ),
                          Text(
                            user?.school?.name ?? 'Sunrise Academy • Guardian',
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
                        'Search subjects, fees, teachers...',
                        style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // ─── Wards Loading & Render ───────────────────────────────────
                childrenAsync.when(
                  data: (children) {
                    if (children.isEmpty) {
                      return _buildNoChildrenCard();
                    }

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Horizontal Child Switcher Bar
                        ChildSwitcherBar(children: children),
                        const SizedBox(height: 20),

                        if (activeChild != null) ...[
                          // ─── Hero Highlight Cards (Lime/Neon Accent from Inspiration) ───
                          Row(
                            children: [
                              // Left: Fees Due Card
                              Expanded(
                                child: InkWell(
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => ChildFeesScreen(child: activeChild),
                                      ),
                                    );
                                  },
                                  borderRadius: BorderRadius.circular(24),
                                  child: Container(
                                    padding: const EdgeInsets.all(18),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFE2F952), // Vibrant Lime from Inspiration
                                      borderRadius: BorderRadius.circular(24),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              'MWK ${(activeChild.feeBalance / 1000).toStringAsFixed(0)}K',
                                              style: const TextStyle(
                                                fontSize: 20,
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
                                              child: const Icon(
                                                Icons.chevron_right,
                                                color: Colors.white,
                                                size: 16,
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 8),
                                        const Text(
                                          'Term Fees Due',
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

                              // Right: Morning Attendance Presence Card
                              Expanded(
                                child: InkWell(
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => ChildAttendanceScreen(child: activeChild),
                                      ),
                                    );
                                  },
                                  borderRadius: BorderRadius.circular(24),
                                  child: Container(
                                    padding: const EdgeInsets.all(18),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFE2F952), // Vibrant Lime from Inspiration
                                      borderRadius: BorderRadius.circular(24),
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              '${activeChild.attendanceRate.toStringAsFixed(0)}%',
                                              style: const TextStyle(
                                                fontSize: 20,
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
                                              child: const Icon(
                                                Icons.chevron_right,
                                                color: Colors.white,
                                                size: 16,
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 8),
                                        const Text(
                                          'Roll-Call Rate',
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
                                    if (cat == 'Attendance') {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (_) => ChildAttendanceScreen(child: activeChild)),
                                      );
                                    } else if (cat == 'Academics') {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (_) => ChildAcademicsScreen(child: activeChild)),
                                      );
                                    } else if (cat == 'Fees & Pay') {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (_) => ChildFeesScreen(child: activeChild)),
                                      );
                                    } else if (cat == 'Timetable') {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (_) => ChildTimetableScreen(child: activeChild)),
                                      );
                                    } else if (cat == 'Events') {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(builder: (_) => const SchoolCalendarScreen()),
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
                          const SizedBox(height: 24),

                          // ─── Hero Announcement Card (From Screen 1 of Inspiration) ───
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Announcements',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                  color: AppTheme.textMainLight,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (_) => const AnnouncementsScreen()),
                                  );
                                },
                                child: const Text('View all', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),

                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: const Color(0xFF1E293B), // Modern dark container matching inspiration
                              borderRadius: BorderRadius.circular(24),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.15),
                                  blurRadius: 14,
                                  offset: const Offset(0, 6),
                                ),
                              ],
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text(
                                      'Midterm Exams Notice',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withValues(alpha: 0.15),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: const Text(
                                        '2h ago',
                                        style: TextStyle(color: Colors.white70, fontSize: 11),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'Term 2 continuous assessment test schedules and laboratory rooms have been officially published.',
                                  style: TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
                                ),
                                const SizedBox(height: 16),
                                InkWell(
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(builder: (_) => const AnnouncementsScreen()),
                                    );
                                  },
                                  borderRadius: BorderRadius.circular(20),
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: const Row(
                                      mainAxisSize: MainAxisSize.min,
                                      children: [
                                        Text(
                                          'Read More',
                                          style: TextStyle(
                                            color: Colors.black,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 12,
                                          ),
                                        ),
                                        SizedBox(width: 6),
                                        Icon(Icons.arrow_forward_rounded, size: 14, color: Colors.black),
                                      ],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),

                          // ─── Child 360 Pulse Card ─────────────────────────────────
                          Child360Card(child: activeChild),
                          const SizedBox(height: 24),

                          // ─── Quick Actions Grid (From Inspiration) ────────────────
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Quick Actions',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w800,
                                  color: AppTheme.textMainLight,
                                ),
                              ),
                              TextButton(
                                onPressed: () => _scaffoldKey.currentState?.openDrawer(),
                                child: const Text('View all', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),

                          Row(
                            children: [
                              Expanded(
                                child: _QuickActionCard(
                                  icon: Icons.payments_outlined,
                                  label: 'Fee Statement',
                                  color: const Color(0xFF0F766E),
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(builder: (_) => ChildFeesScreen(child: activeChild)),
                                    );
                                  },
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _QuickActionCard(
                                  icon: Icons.calendar_month_outlined,
                                  label: 'Class Schedule',
                                  color: const Color(0xFF4338CA),
                                  onTap: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(builder: (_) => ChildTimetableScreen(child: activeChild)),
                                    );
                                  },
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _QuickActionCard(
                                  icon: Icons.forum_outlined,
                                  label: 'Teacher Chat',
                                  color: const Color(0xFFD97706),
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
                      ],
                    );
                  },
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 40),
                      child: CircularProgressIndicator(),
                    ),
                  ),
                  error: (err, _) => Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text('Could not load wards: $err'),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNoChildrenCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            const Icon(Icons.family_restroom, size: 48, color: AppTheme.textMutedLight),
            const SizedBox(height: 12),
            const Text(
              'No Student Profile Linked',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 6),
            const Text(
              'Please contact Sunrise Academy administration to link your ward\'s admission number.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: AppTheme.textMutedLight),
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 10),
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
          children: [
            CircleAvatar(
              radius: 18,
              backgroundColor: color.withValues(alpha: 0.12),
              child: Icon(icon, color: color, size: 18),
            ),
            const SizedBox(height: 8),
            Text(
              label,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: AppTheme.textMainLight,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
