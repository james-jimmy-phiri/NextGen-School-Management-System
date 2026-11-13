import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class StatusBadge extends StatelessWidget {
  final String label;
  final Color? color;
  final Color? backgroundColor;
  final IconData? icon;

  const StatusBadge({
    super.key,
    required this.label,
    this.color,
    this.backgroundColor,
    this.icon,
  });

  factory StatusBadge.forRole(String role) {
    switch (role.toLowerCase()) {
      case 'parent':
        return const StatusBadge(
          label: 'Guardian',
          color: Color(0xFF0284C7),
          backgroundColor: Color(0xFFE0F2FE),
          icon: Icons.family_restroom,
        );
      case 'teacher':
        return const StatusBadge(
          label: 'Teacher',
          color: Color(0xFF059669),
          backgroundColor: Color(0xFFD1FAE5),
          icon: Icons.school,
        );
      case 'school_admin':
      case 'school_director':
        return const StatusBadge(
          label: 'Administrator',
          color: Color(0xFF7C3AED),
          backgroundColor: Color(0xFFEDE9FE),
          icon: Icons.shield,
        );
      case 'super_admin':
        return const StatusBadge(
          label: 'Platform Admin',
          color: Color(0xFFDC2626),
          backgroundColor: Color(0xFFFEE2E2),
          icon: Icons.admin_panel_settings,
        );
      default:
        return StatusBadge(
          label: role,
          color: AppTheme.textMutedLight,
          backgroundColor: const Color(0xFFF1F5F9),
        );
    }
  }

  factory StatusBadge.forAttendance(String status) {
    switch (status.toLowerCase()) {
      case 'present':
        return const StatusBadge(
          label: 'Present',
          color: Color(0xFF059669),
          backgroundColor: Color(0xFFD1FAE5),
          icon: Icons.check_circle_outline,
        );
      case 'late':
        return const StatusBadge(
          label: 'Late',
          color: Color(0xFFD97706),
          backgroundColor: Color(0xFFFEF3C7),
          icon: Icons.access_time,
        );
      case 'absent':
        return const StatusBadge(
          label: 'Absent',
          color: Color(0xFFE11D48),
          backgroundColor: Color(0xFFFFE4E6),
          icon: Icons.cancel_outlined,
        );
      case 'excused':
      default:
        return const StatusBadge(
          label: 'Excused',
          color: Color(0xFF4B5563),
          backgroundColor: Color(0xFFF3F4F6),
          icon: Icons.info_outline,
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final effectiveColor = color ?? AppTheme.primary;
    final effectiveBg = backgroundColor ?? effectiveColor.withValues(alpha: 0.12);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: effectiveBg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, size: 13, color: effectiveColor),
            const SizedBox(width: 4),
          ],
          Text(
            label,
            style: TextStyle(
              color: effectiveColor,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

