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
import '../data/models/admin_telemetry_model.dart';
import '../state/admin_state.dart';
import 'screens/emergency_broadcast_screen.dart';
import 'screens/pending_approvals_screen.dart';

class AdminHomeScreen extends ConsumerStatefulWidget {
  const AdminHomeScreen({super.key});

  @override
  ConsumerState<AdminHomeScreen> createState() => _AdminHomeScreenState();
}

class _AdminHomeScreenState extends ConsumerState<AdminHomeScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  int _activeDockIndex = 0;
  String _selectedCategory = 'Overview';

  final List<String> _categories = [
    'Overview',
    'Approvals',
    'Emergency Alert',
    'Calendar',
    'Circulars',
    'Messages',
  ];

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;
    final telemetryAsync = ref.watch(adminTelemetryProvider);
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
              MaterialPageRoute(builder: (_) => const PendingApprovalsScreen()),
            );
          } else if (index == 2) {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const EmergencyBroadcastScreen()),
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
          onRefresh: () async => ref.refresh(adminTelemetryProvider),
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
                          name: user?.name ?? 'Admin',
                          initials: user?.avatarInitials ?? 'A',
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
                            'Hello, ${user?.name.split(' ')[0] ?? 'Headteacher'}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w800,
                              color: AppTheme.textMainLight,
                            ),
                          ),
                          Text(
                            user?.school?.name ?? 'Sunrise Academy • Executive Cockpit',
                            style: const TextStyle(
                              fontSize: 12,
                              color: AppTheme.textMutedLight,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Emergency Broadcast Shortcut
                    IconButton(
                      icon: const Icon(Icons.campaign, color: Color(0xFFDC2626), size: 28),
                      tooltip: 'Emergency Broadcast',
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const EmergencyBroadcastScreen()),
                        );
                      },
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
                        'Search learners, educators, financial arrears...',
                        style: TextStyle(color: Colors.grey.shade500, fontSize: 13),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // ─── Hero Highlight Cards (Lime/Neon Accent from Inspiration) ───
                telemetryAsync.maybeWhen(
                  data: (data) => Row(
                    children: [
                      // Left: Fees Collected
                      Expanded(
                        child: InkWell(
                          onTap: () {},
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
                                      '${data.collectionRate.toStringAsFixed(0)}%',
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
                                      child: const Icon(Icons.chevron_right, color: Colors.white, size: 16),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'Fee Collection Rate',
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

                      // Right: Attendance Presence
                      Expanded(
                        child: InkWell(
                          onTap: () {},
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
                                      '${data.attendanceRate.toStringAsFixed(0)}%',
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
                                      child: const Icon(Icons.chevron_right, color: Colors.white, size: 16),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'School Attendance',
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
                  orElse: () => const SizedBox.shrink(),
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
                          if (cat == 'Approvals') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const PendingApprovalsScreen()),
                            );
                          } else if (cat == 'Emergency Alert') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const EmergencyBroadcastScreen()),
                            );
                          } else if (cat == 'Calendar') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const SchoolCalendarScreen()),
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

                // ─── Pending Approvals Alert Banner ──────────────────────────────
                telemetryAsync.maybeWhen(
                  data: (telemetry) {
                    if (telemetry.approvalsCount == 0) return const SizedBox.shrink();
                    return Container(
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
                            child: const Icon(Icons.approval, color: Color(0xFFB45309), size: 22),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${telemetry.approvalsCount} Pending Request${telemetry.approvalsCount > 1 ? 's' : ''}',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 14,
                                    color: Color(0xFF92400E),
                                  ),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Staff leave & transfer clearances awaiting review.',
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
                            onPressed: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(builder: (_) => const PendingApprovalsScreen()),
                              );
                            },
                            child: const Text('Review', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                    );
                  },
                  orElse: () => const SizedBox.shrink(),
                ),

                // ─── Real-Time School Telemetry KPIs ─────────────────────────────
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'School Telemetry Pulse',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textMainLight,
                      ),
                    ),
                    TextButton.icon(
                      icon: const Icon(Icons.refresh, size: 16),
                      label: const Text('Sync', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      onPressed: () => ref.refresh(adminTelemetryProvider),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                telemetryAsync.when(
                  data: (data) => _buildTelemetryGrid(context, data),
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.symmetric(vertical: 36),
                      child: CircularProgressIndicator(),
                    ),
                  ),
                  error: (err, _) => Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Text('Could not load telemetry: $err'),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // ─── Administrative Action Center ────────────────────────────────
                const Text(
                  'Institutional Operations',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textMainLight,
                  ),
                ),
                const SizedBox(height: 12),

                _ActionCard(
                  icon: Icons.campaign_rounded,
                  iconColor: const Color(0xFFDC2626),
                  iconBg: const Color(0xFFFEE2E2),
                  title: 'Emergency Guardian Broadcast',
                  subtitle: 'Push immediate alert & SMS to enrolled households',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const EmergencyBroadcastScreen()),
                    );
                  },
                ),
                const SizedBox(height: 10),
                _ActionCard(
                  icon: Icons.assignment_turned_in_outlined,
                  iconColor: const Color(0xFF4338CA),
                  iconBg: const Color(0xFFEEF2FF),
                  title: 'Pending Staff & Learner Approvals',
                  subtitle: 'Review leave requests and student transfers',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const PendingApprovalsScreen()),
                    );
                  },
                ),
                const SizedBox(height: 10),
                _ActionCard(
                  icon: Icons.newspaper_outlined,
                  iconColor: const Color(0xFF0F766E),
                  iconBg: const Color(0xFFCCFBF1),
                  title: 'School Circulars & Notices',
                  subtitle: 'Draft and review published announcements',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const AnnouncementsScreen()),
                    );
                  },
                ),
                const SizedBox(height: 10),
                _ActionCard(
                  icon: Icons.event_note,
                  iconColor: const Color(0xFFD97706),
                  iconBg: const Color(0xFFFEF3C7),
                  title: 'Institutional Calendar & Events',
                  subtitle: 'Term dates, exams, holidays, and meetings',
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SchoolCalendarScreen()),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTelemetryGrid(BuildContext context, AdminTelemetryModel data) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _MetricCard(
                title: 'Enrolled Learners',
                value: '${data.totalEnrolled}',
                delta: '${data.utilizationPercent.toStringAsFixed(0)}% capacity',
                icon: Icons.people_outline,
                color: const Color(0xFF0284C7),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _MetricCard(
                title: 'Today\'s Attendance',
                value: '${data.attendanceRate.toStringAsFixed(1)}%',
                delta: '${data.presentCount} present, ${data.absentCount} absent',
                icon: Icons.fact_check_outlined,
                color: AppTheme.success,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _MetricCard(
                title: 'Term Fees Collected',
                value: '${data.collectionRate.toStringAsFixed(1)}%',
                delta: '${data.currency} ${_formatMillions(data.totalCollected)} / ${_formatMillions(data.totalBilled)}',
                icon: Icons.payments_outlined,
                color: const Color(0xFF7C3AED),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _MetricCard(
                title: 'Staff On Duty',
                value: '${data.staffOnDuty} / ${data.totalStaff}',
                delta: '${data.totalStaff - data.staffOnDuty} on approved leave',
                icon: Icons.badge_outlined,
                color: const Color(0xFFD97706),
              ),
            ),
          ],
        ),
      ],
    );
  }

  String _formatMillions(double val) {
    if (val >= 1000000) {
      return '${(val / 1000000).toStringAsFixed(1)}M';
    } else if (val >= 1000) {
      return '${(val / 1000).toStringAsFixed(0)}K';
    }
    return val.toStringAsFixed(0);
  }
}

class _MetricCard extends StatelessWidget {
  final String title;
  final String value;
  final String delta;
  final IconData icon;
  final Color color;

  const _MetricCard({
    required this.title,
    required this.value,
    required this.delta,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight)),
              Icon(icon, size: 20, color: color),
            ],
          ),
          const SizedBox(height: 10),
          Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900)),
          const SizedBox(height: 4),
          Text(
            delta,
            style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w700),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final Color iconBg;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _ActionCard({
    required this.icon,
    required this.iconColor,
    required this.iconBg,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade200),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        leading: CircleAvatar(
          backgroundColor: iconBg,
          child: Icon(icon, color: iconColor),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: AppTheme.textMutedLight)),
        trailing: const Icon(Icons.chevron_right, color: Colors.grey),
        onTap: onTap,
      ),
    );
  }
}
