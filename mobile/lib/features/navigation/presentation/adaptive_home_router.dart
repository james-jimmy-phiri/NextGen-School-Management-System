import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../admin/presentation/admin_home_screen.dart';
import '../../auth/state/auth_state.dart';
import '../../parent/presentation/parent_home_screen.dart';
import '../../student/presentation/student_home_screen.dart';
import '../../teacher/presentation/teacher_home_screen.dart';

class AdaptiveHomeRouter extends ConsumerWidget {
  const AdaptiveHomeRouter({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final effectiveRole = authState.effectiveRole.toLowerCase();

    switch (effectiveRole) {
      case 'parent':
        return const ParentHomeScreen();

      case 'teacher':
        return const TeacherHomeScreen();

      case 'school_admin':
      case 'school_director':
      case 'super_admin':
      case 'accountant':
      case 'registrar':
        return const AdminHomeScreen();

      case 'student':
        return const StudentHomeScreen();

      default:
        return const ParentHomeScreen();
    }
  }
}

