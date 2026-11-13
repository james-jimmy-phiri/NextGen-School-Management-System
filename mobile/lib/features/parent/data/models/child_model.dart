class AttendanceSummaryModel {
  final int percentage;
  final int presentDays;
  final int absentDays;
  final int lateDays;
  final int totalDays;

  const AttendanceSummaryModel({
    required this.percentage,
    required this.presentDays,
    required this.absentDays,
    required this.lateDays,
    required this.totalDays,
  });

  factory AttendanceSummaryModel.fromJson(Map<String, dynamic> json) {
    return AttendanceSummaryModel(
      percentage: (json['percentage'] as num?)?.toInt() ?? 95,
      presentDays: (json['present_days'] as num?)?.toInt() ?? 0,
      absentDays: (json['absent_days'] as num?)?.toInt() ?? 0,
      lateDays: (json['late_days'] as num?)?.toInt() ?? 0,
      totalDays: (json['total_days'] as num?)?.toInt() ?? 0,
    );
  }
}

class FinanceSummaryModel {
  final double balanceDue;
  final double totalFees;
  final double amountPaid;
  final String currency;
  final bool hasOverdue;

  const FinanceSummaryModel({
    required this.balanceDue,
    required this.totalFees,
    required this.amountPaid,
    required this.currency,
    required this.hasOverdue,
  });

  factory FinanceSummaryModel.fromJson(Map<String, dynamic> json) {
    return FinanceSummaryModel(
      balanceDue: (json['balance_due'] as num?)?.toDouble() ?? 0.0,
      totalFees: (json['total_fees'] as num?)?.toDouble() ?? 0.0,
      amountPaid: (json['amount_paid'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'MWK',
      hasOverdue: json['has_overdue'] as bool? ?? false,
    );
  }
}

class AcademicSummaryModel {
  final double latestAverage;
  final int totalSubjects;

  const AcademicSummaryModel({
    required this.latestAverage,
    required this.totalSubjects,
  });

  factory AcademicSummaryModel.fromJson(Map<String, dynamic> json) {
    return AcademicSummaryModel(
      latestAverage: (json['latest_average'] as num?)?.toDouble() ?? 80.0,
      totalSubjects: (json['total_subjects'] as num?)?.toInt() ?? 8,
    );
  }
}

class BehaviourSummaryModel {
  final int meritPoints;
  final int awardsCount;

  const BehaviourSummaryModel({
    required this.meritPoints,
    required this.awardsCount,
  });

  factory BehaviourSummaryModel.fromJson(Map<String, dynamic> json) {
    return BehaviourSummaryModel(
      meritPoints: (json['merit_points'] as num?)?.toInt() ?? 100,
      awardsCount: (json['awards_count'] as num?)?.toInt() ?? 0,
    );
  }
}

class ChildModel {
  final int id;
  final String admissionNumber;
  final String firstName;
  final String lastName;
  final String name;
  final String? gender;
  final String? dateOfBirth;
  final String? photoUrl;
  final String status;
  final String className;
  final String academicYear;
  final String schoolName;
  final AttendanceSummaryModel attendanceSummary;
  final FinanceSummaryModel financeSummary;
  final AcademicSummaryModel academicSummary;
  final BehaviourSummaryModel behaviourSummary;

  const ChildModel({
    required this.id,
    required this.admissionNumber,
    required this.firstName,
    required this.lastName,
    required this.name,
    this.gender,
    this.dateOfBirth,
    this.photoUrl,
    required this.status,
    required this.className,
    required this.academicYear,
    required this.schoolName,
    required this.attendanceSummary,
    required this.financeSummary,
    required this.academicSummary,
    required this.behaviourSummary,
  });

  String get initials {
    if (firstName.isNotEmpty && lastName.isNotEmpty) {
      return '${firstName[0]}${lastName[0]}'.toUpperCase();
    }
    if (name.isNotEmpty) return name[0].toUpperCase();
    return 'W';
  }

  double get feeBalance => financeSummary.balanceDue;
  int get attendanceRate => attendanceSummary.percentage;

  factory ChildModel.fromJson(Map<String, dynamic> json) {
    return ChildModel(
      id: json['id'] as int? ?? 0,
      admissionNumber: json['admission_number'] as String? ?? 'ADM-000',
      firstName: json['first_name'] as String? ?? '',
      lastName: json['last_name'] as String? ?? '',
      name: json['name'] as String? ?? 'Learner',
      gender: json['gender'] as String?,
      dateOfBirth: json['date_of_birth'] as String?,
      photoUrl: json['photo_url'] as String?,
      status: json['status'] as String? ?? 'active',
      className: json['class_name'] as String? ?? 'Form 3 · Stream A',
      academicYear: json['academic_year'] as String? ?? '2026 / 2027',
      schoolName: json['school_name'] as String? ?? 'Sunrise Academy',
      attendanceSummary: AttendanceSummaryModel.fromJson(
        json['attendance_summary'] as Map<String, dynamic>? ?? {},
      ),
      financeSummary: FinanceSummaryModel.fromJson(
        json['finance_summary'] as Map<String, dynamic>? ?? {},
      ),
      academicSummary: AcademicSummaryModel.fromJson(
        json['academic_summary'] as Map<String, dynamic>? ?? {},
      ),
      behaviourSummary: BehaviourSummaryModel.fromJson(
        json['behaviour_summary'] as Map<String, dynamic>? ?? {},
      ),
    );
  }
}

