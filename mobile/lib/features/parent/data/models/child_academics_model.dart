class SubjectGradeItem {
  final int id;
  final String name;
  final String code;
  final double score;
  final String grade;
  final String comment;

  const SubjectGradeItem({
    required this.id,
    required this.name,
    required this.code,
    required this.score,
    required this.grade,
    required this.comment,
  });

  factory SubjectGradeItem.fromJson(Map<String, dynamic> json) {
    return SubjectGradeItem(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      code: json['code'] as String? ?? '',
      score: (json['score'] as num?)?.toDouble() ?? 0.0,
      grade: json['grade'] as String? ?? '-',
      comment: json['comment'] as String? ?? '',
    );
  }
}

class AssessmentScoreItem {
  final int id;
  final String title;
  final String type;
  final String subject;
  final double score;
  final double maxScore;
  final double percentage;
  final String date;
  final String remarks;

  const AssessmentScoreItem({
    required this.id,
    required this.title,
    required this.type,
    required this.subject,
    required this.score,
    required this.maxScore,
    required this.percentage,
    required this.date,
    required this.remarks,
  });

  factory AssessmentScoreItem.fromJson(Map<String, dynamic> json) {
    return AssessmentScoreItem(
      id: json['id'] as int? ?? 0,
      title: json['title'] as String? ?? 'Assessment',
      type: json['type'] as String? ?? 'Quiz',
      subject: json['subject'] as String? ?? '',
      score: (json['score'] as num?)?.toDouble() ?? 0.0,
      maxScore: (json['max_score'] as num?)?.toDouble() ?? 100.0,
      percentage: (json['percentage'] as num?)?.toDouble() ?? 0.0,
      date: json['date'] as String? ?? '',
      remarks: json['remarks'] as String? ?? '',
    );
  }
}

class ChildAcademicsData {
  final List<SubjectGradeItem> subjects;
  final List<AssessmentScoreItem> assessments;
  final double termAverage;
  final String termLabel;

  const ChildAcademicsData({
    required this.subjects,
    required this.assessments,
    required this.termAverage,
    required this.termLabel,
  });

  factory ChildAcademicsData.fromJson(Map<String, dynamic> json) {
    final rawSubjects = json['subjects'] as List<dynamic>? ?? [];
    final rawAssessments = json['assessments'] as List<dynamic>? ?? [];

    return ChildAcademicsData(
      subjects: rawSubjects
          .map((s) => SubjectGradeItem.fromJson(s as Map<String, dynamic>))
          .toList(),
      assessments: rawAssessments
          .map((a) => AssessmentScoreItem.fromJson(a as Map<String, dynamic>))
          .toList(),
      termAverage: (json['term_average'] as num?)?.toDouble() ?? 80.0,
      termLabel: json['term_label'] as String? ?? 'Current Term',
    );
  }
}

