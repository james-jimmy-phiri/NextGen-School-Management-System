class AdminTelemetryModel {
  final String schoolName;
  final String generatedAt;
  final int totalEnrolled;
  final int capacity;
  final double utilizationPercent;
  final int totalStaff;
  final int staffOnDuty;
  final double attendanceRate;
  final int totalAttendanceLogged;
  final int presentCount;
  final int absentCount;
  final int lateCount;
  final int excusedCount;
  final String currency;
  final double totalBilled;
  final double totalCollected;
  final double outstandingArrears;
  final double collectionRate;
  final int approvalsCount;
  final int recentAlertsCount;

  const AdminTelemetryModel({
    required this.schoolName,
    required this.generatedAt,
    required this.totalEnrolled,
    required this.capacity,
    required this.utilizationPercent,
    required this.totalStaff,
    required this.staffOnDuty,
    required this.attendanceRate,
    required this.totalAttendanceLogged,
    required this.presentCount,
    required this.absentCount,
    required this.lateCount,
    required this.excusedCount,
    required this.currency,
    required this.totalBilled,
    required this.totalCollected,
    required this.outstandingArrears,
    required this.collectionRate,
    required this.approvalsCount,
    required this.recentAlertsCount,
  });

  factory AdminTelemetryModel.fromJson(Map<String, dynamic> json) {
    final students = json['students'] as Map<String, dynamic>? ?? {};
    final staff = json['staff'] as Map<String, dynamic>? ?? {};
    final attendance = json['attendance'] as Map<String, dynamic>? ?? {};
    final finance = json['finance'] as Map<String, dynamic>? ?? {};

    return AdminTelemetryModel(
      schoolName: json['school_name'] as String? ?? 'Sunrise Academy',
      generatedAt: json['generated_at'] as String? ?? '',
      totalEnrolled: (students['total_enrolled'] as num?)?.toInt() ?? 0,
      capacity: (students['capacity'] as num?)?.toInt() ?? 1200,
      utilizationPercent: (students['utilization_percent'] as num?)?.toDouble() ?? 0.0,
      totalStaff: (staff['total_staff'] as num?)?.toInt() ?? 0,
      staffOnDuty: (staff['on_duty'] as num?)?.toInt() ?? 0,
      attendanceRate: (attendance['attendance_rate'] as num?)?.toDouble() ?? 0.0,
      totalAttendanceLogged: (attendance['total_logged'] as num?)?.toInt() ?? 0,
      presentCount: (attendance['present'] as num?)?.toInt() ?? 0,
      absentCount: (attendance['absent'] as num?)?.toInt() ?? 0,
      lateCount: (attendance['late'] as num?)?.toInt() ?? 0,
      excusedCount: (attendance['excused'] as num?)?.toInt() ?? 0,
      currency: finance['currency'] as String? ?? 'MWK',
      totalBilled: (finance['total_billed'] as num?)?.toDouble() ?? 0.0,
      totalCollected: (finance['total_collected'] as num?)?.toDouble() ?? 0.0,
      outstandingArrears: (finance['outstanding_arrears'] as num?)?.toDouble() ?? 0.0,
      collectionRate: (finance['collection_rate'] as num?)?.toDouble() ?? 0.0,
      approvalsCount: (json['approvals_count'] as num?)?.toInt() ?? 0,
      recentAlertsCount: (json['recent_alerts_count'] as num?)?.toInt() ?? 0,
    );
  }
}

class PendingApprovalModel {
  final int id;
  final String type;
  final String category;
  final String title;
  final String requesterName;
  final String requesterRole;
  final String submittedAt;
  final String details;
  final String status;

  const PendingApprovalModel({
    required this.id,
    required this.type,
    required this.category,
    required this.title,
    required this.requesterName,
    required this.requesterRole,
    required this.submittedAt,
    required this.details,
    required this.status,
  });

  factory PendingApprovalModel.fromJson(Map<String, dynamic> json) {
    return PendingApprovalModel(
      id: json['id'] as int? ?? 0,
      type: json['type'] as String? ?? '',
      category: json['category'] as String? ?? 'General',
      title: json['title'] as String? ?? 'Approval Request',
      requesterName: json['requester_name'] as String? ?? 'Staff Member',
      requesterRole: json['requester_role'] as String? ?? 'Teacher',
      submittedAt: json['submitted_at'] as String? ?? '',
      details: json['details'] as String? ?? '',
      status: json['status'] as String? ?? 'pending',
    );
  }
}

