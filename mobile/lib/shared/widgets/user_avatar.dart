import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

class UserAvatar extends StatelessWidget {
  final String? initials;
  final String? name;
  final double radius;
  final Color? backgroundColor;
  final Color? textColor;

  const UserAvatar({
    super.key,
    this.initials,
    this.name,
    this.radius = 20,
    this.backgroundColor,
    this.textColor,
  });

  String get effectiveInitials {
    if (initials != null && initials!.isNotEmpty) {
      return initials!;
    }
    if (name != null && name!.trim().isNotEmpty) {
      final parts = name!.trim().split(RegExp(r'\s+'));
      if (parts.length >= 2) {
        return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    return '?';
  }

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: radius,
      backgroundColor: backgroundColor ?? AppTheme.primaryLight.withValues(alpha: 0.15),
      child: Text(
        effectiveInitials,
        style: TextStyle(
          color: textColor ?? AppTheme.primary,
          fontWeight: FontWeight.w700,
          fontSize: radius * 0.8,
        ),
      ),
    );
  }
}

