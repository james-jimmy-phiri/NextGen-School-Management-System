import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/status_badge.dart';
import '../../../../shared/widgets/user_avatar.dart';
import '../../data/models/child_model.dart';
import '../screens/child_academics_screen.dart';
import '../screens/child_attendance_screen.dart';
import '../screens/child_fees_screen.dart';
import '../screens/child_timetable_screen.dart';

class Child360Card extends StatelessWidget {
  final ChildModel child;

  const Child360Card({
    super.key,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final attPct = child.attendanceSummary.percentage;
    final attColor = attPct >= 90
        ? AppTheme.success
        : (attPct >= 80 ? AppTheme.warning : AppTheme.error);

    final balance = child.financeSummary.balanceDue;
    final balanceText = balance <= 0
        ? 'Cleared'
        : '${child.financeSummary.currency} ${balance.toStringAsFixed(0)}';

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: const BorderSide(color: AppTheme.borderLight),
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ─── Header: Avatar, Name, Class & Status ────────────────────────
            Row(
              children: [
                UserAvatar(
                  name: child.name,
                  initials: child.initials,
                  radius: 26,
                  backgroundColor: AppTheme.primary.withValues(alpha: 0.1),
                  textColor: AppTheme.primary,
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        child.name,
                        style: const TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textMainLight,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Row(
                        children: [
                          Text(
                            child.className,
                            style: const TextStyle(
                              fontSize: 13,
                              color: AppTheme.textMutedLight,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppTheme.borderLight,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              child.admissionNumber,
                              style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                StatusBadge.forRole('parent'),
              ],
            ),
            const SizedBox(height: 18),

            // ─── Three 360 Pulse Metrics ─────────────────────────────────────
            Container(
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppTheme.borderLight),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _MetricColumn(
                    label: 'Attendance',
                    value: '$attPct%',
                    valueColor: attColor,
                    icon: Icons.check_circle_outline,
                  ),
                  Container(height: 32, width: 1, color: AppTheme.borderLight),
                  _MetricColumn(
                    label: 'Fees Balance',
                    value: balanceText,
                    valueColor: balance <= 0 ? AppTheme.success : AppTheme.error,
                    icon: Icons.account_balance_wallet_outlined,
                  ),
                  Container(height: 32, width: 1, color: AppTheme.borderLight),
                  _MetricColumn(
                    label: 'Term Average',
                    value: '${child.academicSummary.latestAverage.toStringAsFixed(1)}%',
                    valueColor: AppTheme.primary,
                    icon: Icons.auto_stories_outlined,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // ─── Quick Navigation Actions ────────────────────────────────────
            Row(
              children: [
                Expanded(
                  child: _QuickActionButton(
                    icon: Icons.checklist_rounded,
                    label: 'Attendance',
                    color: const Color(0xFF059669),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ChildAttendanceScreen(child: child),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _QuickActionButton(
                    icon: Icons.bar_chart_rounded,
                    label: 'Academics',
                    color: const Color(0xFF4338CA),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ChildAcademicsScreen(child: child),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _QuickActionButton(
                    icon: Icons.receipt_long_rounded,
                    label: 'Fees',
                    color: const Color(0xFF0284C7),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ChildFeesScreen(child: child),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _QuickActionButton(
                    icon: Icons.schedule_rounded,
                    label: 'Timetable',
                    color: const Color(0xFFD97706),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ChildTimetableScreen(child: child),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _MetricColumn extends StatelessWidget {
  final String label;
  final String value;
  final Color valueColor;
  final IconData icon;

  const _MetricColumn({
    required this.label,
    required this.value,
    required this.valueColor,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14, color: valueColor),
            const SizedBox(width: 4),
            Text(
              value,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: valueColor,
              ),
            ),
          ],
        ),
        const SizedBox(height: 3),
        Text(
          label,
          style: const TextStyle(fontSize: 11, color: AppTheme.textMutedLight),
        ),
      ],
    );
  }
}

class _QuickActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withValues(alpha: 0.2)),
        ),
        child: Column(
          children: [
            Icon(icon, size: 20, color: color),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

