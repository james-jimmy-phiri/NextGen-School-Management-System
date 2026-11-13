import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/api_client.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/status_badge.dart';
import '../../../shared/widgets/user_avatar.dart';
import '../../admin/presentation/screens/emergency_broadcast_screen.dart';
import '../../admin/presentation/screens/pending_approvals_screen.dart';
import '../../auth/state/auth_state.dart';
import '../../communication/presentation/screens/announcements_screen.dart';
import '../../communication/presentation/screens/messages_inbox_screen.dart';
import '../../communication/presentation/screens/school_calendar_screen.dart';
import '../../communication/state/communication_state.dart';

class AppNavDrawer extends ConsumerWidget {
  const AppNavDrawer({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;
    final currentRole = authState.effectiveRole;
    final currentBaseUrl = ref.watch(apiBaseUrlProvider);

    if (user == null) {
      return const Drawer(child: Center(child: Text('Not signed in')));
    }

    return Drawer(
      child: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ─── User Profile Header ──────────────────────────────────────────
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              decoration: BoxDecoration(
                color: AppTheme.primary.withValues(alpha: 0.05),
                border: const Border(bottom: BorderSide(color: AppTheme.borderLight)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      UserAvatar(
                        name: user.name,
                        initials: user.avatarInitials,
                        radius: 26,
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 16,
                                color: AppTheme.textMainLight,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              user.email ?? user.phone ?? '',
                              style: const TextStyle(
                                fontSize: 13,
                                color: AppTheme.textMutedLight,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      StatusBadge.forRole(currentRole),
                      const SizedBox(width: 8),
                      if (user.school != null)
                        Expanded(
                          child: Text(
                            user.school!.name,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w500,
                              color: AppTheme.textMutedLight,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),

            // ─── Multi-Role Switcher (if user holds multiple roles) ────────────
            if (user.roles.length > 1) ...[
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                child: Row(
                  children: [
                    const Icon(Icons.swap_horiz, size: 16, color: AppTheme.textMutedLight),
                    const SizedBox(width: 8),
                    Text(
                      'SWITCH WORKSPACE ROLE',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textMutedLight.withValues(alpha: 0.9),
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
              ...user.roles.map((r) {
                final isCurrent = r.toLowerCase() == currentRole.toLowerCase();
                return ListTile(
                  dense: true,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20),
                  leading: Icon(
                    r == 'parent'
                        ? Icons.family_restroom
                        : r == 'teacher'
                            ? Icons.school
                            : Icons.admin_panel_settings,
                    color: isCurrent ? AppTheme.primary : AppTheme.textMutedLight,
                    size: 20,
                  ),
                  title: Text(
                    r.replaceAll('_', ' ').toUpperCase(),
                    style: TextStyle(
                      fontWeight: isCurrent ? FontWeight.w700 : FontWeight.w500,
                      color: isCurrent ? AppTheme.primary : AppTheme.textMainLight,
                      fontSize: 13,
                    ),
                  ),
                  trailing: isCurrent
                      ? const Icon(Icons.check_circle, color: AppTheme.primary, size: 18)
                      : null,
                  onTap: () {
                    ref.read(authStateProvider.notifier).switchActiveRole(r);
                    Navigator.pop(context);
                  },
                );
              }),
              const Divider(),
            ],

            // ─── Menu Navigation ──────────────────────────────────────────────
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 8),
                children: [
                  ListTile(
                    leading: const Icon(Icons.dashboard_outlined),
                    title: const Text('Home Dashboard'),
                    selected: true,
                    selectedColor: AppTheme.primary,
                    onTap: () => Navigator.pop(context),
                  ),
                  ListTile(
                    leading: const Icon(Icons.campaign_outlined),
                    title: const Text('Announcements'),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const AnnouncementsScreen()),
                      );
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.chat_bubble_outline),
                    title: const Text('Direct Messages'),
                    trailing: Consumer(
                      builder: (_, ref, __) {
                        final unreadCount = ref.watch(unreadMessagesCountProvider);
                        if (unreadCount <= 0) return const SizedBox.shrink();
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.error,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            '$unreadCount',
                            style: const TextStyle(fontSize: 11, color: Colors.white, fontWeight: FontWeight.bold),
                          ),
                        );
                      },
                    ),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const MessagesInboxScreen()),
                      );
                    },
                  ),
                  ListTile(
                    leading: const Icon(Icons.calendar_month_outlined),
                    title: const Text('School Calendar'),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const SchoolCalendarScreen()),
                      );
                    },
                  ),
                  if (user.isSchoolAdmin) ...[
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.assignment_turned_in_outlined, color: AppTheme.primary),
                      title: const Text('Pending Approvals'),
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const PendingApprovalsScreen()),
                        );
                      },
                    ),
                    ListTile(
                      leading: const Icon(Icons.campaign, color: Color(0xFFDC2626)),
                      title: const Text('Emergency Broadcast'),
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const EmergencyBroadcastScreen()),
                        );
                      },
                    ),
                  ],
                  const Divider(),
                  ListTile(
                    leading: const Icon(Icons.security_outlined),
                    title: const Text('My Permissions & Role'),
                    onTap: () {
                      Navigator.pop(context);
                      _showPermissionsDialog(context, user);
                    },
                  ),
                ],
              ),
            ),

            // ─── Footer with Server status & Logout ───────────────────────────
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: AppTheme.borderLight)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Connected to: $currentBaseUrl',
                    style: const TextStyle(fontSize: 11, color: AppTheme.textMutedLight),
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppTheme.error,
                      side: const BorderSide(color: AppTheme.error),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    icon: const Icon(Icons.logout, size: 18),
                    label: const Text('Sign Out'),
                    onPressed: () {
                      Navigator.pop(context);
                      ref.read(authStateProvider.notifier).logout();
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showPermissionsDialog(BuildContext context, user) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Role & Capabilities'),
        content: SizedBox(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Primary Role: ${user.displayRole}', style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Text('Roles: ${user.roles.join(', ')}'),
              const SizedBox(height: 12),
              const Text('Assigned Permissions:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              if (user.permissions.isEmpty)
                const Text('No direct permissions attached.')
              else
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: user.permissions
                      .map<Widget>((p) => Chip(
                            label: Text(p, style: const TextStyle(fontSize: 11)),
                            padding: EdgeInsets.zero,
                          ))
                      .toList(),
                ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
        ],
      ),
    );
  }
}

