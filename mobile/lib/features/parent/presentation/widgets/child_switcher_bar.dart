import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/user_avatar.dart';
import '../../data/models/child_model.dart';
import '../../state/parent_portal_state.dart';

class ChildSwitcherBar extends ConsumerWidget {
  final List<ChildModel> children;

  const ChildSwitcherBar({
    super.key,
    required this.children,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedIndex = ref.watch(selectedChildIndexProvider);

    if (children.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'MY WARDS / CHILDREN',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AppTheme.textMutedLight,
                letterSpacing: 0.6,
              ),
            ),
            Text(
              '${children.length} Enrolled',
              style: const TextStyle(
                fontSize: 12,
                color: AppTheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 64,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: children.length,
            separatorBuilder: (_, __) => const SizedBox(width: 10),
            itemBuilder: (context, index) {
              final child = children[index];
              final isSelected = index == selectedIndex;

              return Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {
                    ref.read(selectedChildIndexProvider.notifier).state = index;
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? const Color(0xFF0F172A)
                          : Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(
                        color: isSelected
                            ? const Color(0xFF0F172A)
                            : Colors.grey.shade300,
                        width: isSelected ? 1.5 : 1,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.15),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              )
                            ]
                          : null,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        UserAvatar(
                          name: child.name,
                          initials: child.initials,
                          radius: 18,
                          backgroundColor: isSelected
                              ? Colors.white.withValues(alpha: 0.2)
                              : const Color(0xFF0F172A).withValues(alpha: 0.1),
                          textColor: isSelected ? Colors.white : const Color(0xFF0F172A),
                        ),
                        const SizedBox(width: 10),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              child.name,
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                                color: isSelected ? Colors.white : AppTheme.textMainLight,
                              ),
                            ),
                            Text(
                              child.className,
                              style: TextStyle(
                                fontSize: 11,
                                color: isSelected ? const Color(0xFFE2F952) : AppTheme.textMutedLight,
                                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

