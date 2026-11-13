import 'dart:ui';
import 'package:flutter/material.dart';

class FloatingBottomDock extends StatelessWidget {
  final int activeIndex;
  final ValueChanged<int> onIndexChanged;
  final int unreadMessages;
  final VoidCallback onMenuTap;

  const FloatingBottomDock({
    super.key,
    required this.activeIndex,
    required this.onIndexChanged,
    this.unreadMessages = 0,
    required this.onMenuTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 20),
      height: 64,
      decoration: BoxDecoration(
        color: const Color(0xDD1E293B), // Frosted dark slate matching inspiration
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.white.withValues(alpha: 0.12), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.25),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(32),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _DockItem(
                icon: Icons.home_rounded,
                isActive: activeIndex == 0,
                onTap: () => onIndexChanged(0),
              ),
              _DockItem(
                icon: Icons.account_balance_wallet_outlined,
                isActive: activeIndex == 1,
                onTap: () => onIndexChanged(1),
              ),
              _DockItem(
                icon: Icons.school_outlined,
                isActive: activeIndex == 2,
                onTap: () => onIndexChanged(2),
              ),
              _DockItem(
                icon: Icons.chat_bubble_outline_rounded,
                isActive: activeIndex == 3,
                badgeCount: unreadMessages,
                onTap: () => onIndexChanged(3),
              ),
              _DockItem(
                icon: Icons.grid_view_rounded,
                isActive: false,
                onTap: onMenuTap,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DockItem extends StatelessWidget {
  final IconData icon;
  final bool isActive;
  final int badgeCount;
  final VoidCallback onTap;

  const _DockItem({
    required this.icon,
    required this.isActive,
    this.badgeCount = 0,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isActive
              ? const Color(0xFFE2F952).withValues(alpha: 0.2) // Neon lime glow from inspiration
              : Colors.transparent,
          shape: BoxShape.circle,
        ),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Icon(
              icon,
              size: 24,
              color: isActive ? const Color(0xFFE2F952) : Colors.white70,
            ),
            if (badgeCount > 0)
              Positioned(
                top: -4,
                right: -6,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Color(0xFFEF4444),
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    badgeCount > 9 ? '9+' : '$badgeCount',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

