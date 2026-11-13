import 'school_model.dart';

class UserModel {
  final int id;
  final String name;
  final String? email;
  final String? phone;
  final String status;
  final String? lockedAt;
  final String? lockedReason;
  final String? avatarInitials;
  final SchoolModel? school;
  final String? primaryRole;
  final List<String> roles;
  final List<String> permissions;

  const UserModel({
    required this.id,
    required this.name,
    this.email,
    this.phone,
    this.status = 'active',
    this.lockedAt,
    this.lockedReason,
    this.avatarInitials,
    this.school,
    this.primaryRole,
    this.roles = const [],
    this.permissions = const [],
  });

  // ── Role & Permission Capability Helpers ─────────────────────────────────────

  bool hasRole(String role) =>
      roles.map((r) => r.toLowerCase()).contains(role.toLowerCase()) ||
      (primaryRole?.toLowerCase() == role.toLowerCase());

  bool hasAnyRole(List<String> checkRoles) =>
      checkRoles.any((r) => hasRole(r));

  bool hasPermission(String permission) =>
      isSuperAdmin || permissions.contains(permission);

  bool get isParent => hasRole('parent');
  bool get isTeacher => hasRole('teacher');
  bool get isSchoolAdmin => hasAnyRole(['school_admin', 'school_director']);
  bool get isSuperAdmin => hasRole('super_admin');
  bool get isStudent => hasRole('student');
  bool get isAccountant => hasRole('accountant');
  bool get isRegistrar => hasRole('registrar');

  bool get isActive => status == 'active';
  bool get isLocked => status == 'locked' || (lockedAt != null && lockedAt!.isNotEmpty);

  /// Best role to display on badges
  String get displayRole {
    if (isSuperAdmin) return 'Platform Admin';
    if (isSchoolAdmin) return 'School Admin';
    if (isTeacher) return 'Teacher';
    if (isParent) return 'Guardian / Parent';
    if (isStudent) return 'Student';
    return primaryRole ?? 'User';
  }

  factory UserModel.fromJson(Map<String, dynamic> json) {
    List<String> parseStringList(dynamic list) {
      if (list is List) {
        return list.map((item) => item.toString()).toList();
      }
      return [];
    }

    SchoolModel? parsedSchool;
    if (json['school'] is Map<String, dynamic>) {
      parsedSchool = SchoolModel.fromJson(json['school'] as Map<String, dynamic>);
    }

    return UserModel(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? 'User',
      email: json['email'] as String?,
      phone: json['phone'] as String?,
      status: json['status'] as String? ?? 'active',
      lockedAt: json['locked_at'] as String?,
      lockedReason: json['locked_reason'] as String?,
      avatarInitials: json['avatar_initials'] as String?,
      school: parsedSchool,
      primaryRole: json['role'] as String?,
      roles: parseStringList(json['roles']),
      permissions: parseStringList(json['permissions']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      if (email != null) 'email': email,
      if (phone != null) 'phone': phone,
      'status': status,
      if (lockedAt != null) 'locked_at': lockedAt,
      if (lockedReason != null) 'locked_reason': lockedReason,
      if (avatarInitials != null) 'avatar_initials': avatarInitials,
      if (school != null) 'school': school!.toJson(),
      if (primaryRole != null) 'role': primaryRole,
      'roles': roles,
      'permissions': permissions,
    };
  }
}

