class TeacherClassModel {
  final int id;
  final String name;
  final String gradeLevel;
  final int studentCount;
  final List<ClassStreamItem> streams;
  final List<ClassSubjectItem> subjects;

  const TeacherClassModel({
    required this.id,
    required this.name,
    required this.gradeLevel,
    required this.studentCount,
    this.streams = const [],
    this.subjects = const [],
  });

  int get enrolledCount => studentCount;
  bool get isAttendanceMarkedToday => false;
  String get roomNumber => gradeLevel.isNotEmpty ? gradeLevel : 'Main';

  factory TeacherClassModel.fromJson(Map<String, dynamic> json) {
    final rawStreams = json['streams'] as List<dynamic>? ?? [];
    final rawSubjects = json['subjects'] as List<dynamic>? ?? [];

    return TeacherClassModel(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? 'Class',
      gradeLevel: json['grade_level'] as String? ?? '',
      studentCount: (json['student_count'] as num?)?.toInt() ?? 35,
      streams: rawStreams
          .map((s) => ClassStreamItem.fromJson(s as Map<String, dynamic>))
          .toList(),
      subjects: rawSubjects
          .map((sub) => ClassSubjectItem.fromJson(sub as Map<String, dynamic>))
          .toList(),
    );
  }
}

class ClassStreamItem {
  final int id;
  final String name;

  const ClassStreamItem({required this.id, required this.name});

  factory ClassStreamItem.fromJson(Map<String, dynamic> json) {
    return ClassStreamItem(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? 'A',
    );
  }
}

class ClassSubjectItem {
  final int id;
  final String name;
  final String code;

  const ClassSubjectItem({
    required this.id,
    required this.name,
    required this.code,
  });

  factory ClassSubjectItem.fromJson(Map<String, dynamic> json) {
    return ClassSubjectItem(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? '',
      code: json['code'] as String? ?? '',
    );
  }
}

class RosterStudentModel {
  final int id;
  final String admissionNumber;
  final String firstName;
  final String lastName;
  final String name;
  final String gender;
  final String? photoUrl;
  final int? streamId;
  final String streamName;
  final String? status; // 'present', 'late', 'absent', 'excused' or null
  final String? notes;

  const RosterStudentModel({
    required this.id,
    required this.admissionNumber,
    required this.firstName,
    required this.lastName,
    required this.name,
    this.gender = 'unspecified',
    this.photoUrl,
    this.streamId,
    this.streamName = 'A',
    this.status,
    this.notes,
  });

  String get initials {
    if (firstName.isNotEmpty && lastName.isNotEmpty) {
      return '${firstName[0]}${lastName[0]}'.toUpperCase();
    }
    if (name.isNotEmpty) return name[0].toUpperCase();
    return 'S';
  }

  RosterStudentModel copyWith({
    String? status,
    String? notes,
  }) {
    return RosterStudentModel(
      id: id,
      admissionNumber: admissionNumber,
      firstName: firstName,
      lastName: lastName,
      name: name,
      gender: gender,
      photoUrl: photoUrl,
      streamId: streamId,
      streamName: streamName,
      status: status ?? this.status,
      notes: notes ?? this.notes,
    );
  }

  factory RosterStudentModel.fromJson(Map<String, dynamic> json) {
    return RosterStudentModel(
      id: json['id'] as int? ?? 0,
      admissionNumber: json['admission_number'] as String? ?? '',
      firstName: json['first_name'] as String? ?? '',
      lastName: json['last_name'] as String? ?? '',
      name: json['name'] as String? ?? 'Student',
      gender: json['gender'] as String? ?? 'unspecified',
      photoUrl: json['photo_url'] as String?,
      streamId: json['stream_id'] as int?,
      streamName: json['stream_name'] as String? ?? 'A',
      status: json['current_status'] as String? ?? json['status'] as String?,
      notes: json['current_notes'] as String? ?? json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'student_id': id,
      'status': status ?? 'present',
      if (notes != null) 'notes': notes,
    };
  }
}

class TeacherAssessmentModel {
  final int id;
  final String title;
  final String type;
  final String subject;
  final String className;
  final String term;
  final double maxScore;
  final double weight;
  final String? dueAt;
  final int markedCount;

  const TeacherAssessmentModel({
    required this.id,
    required this.title,
    required this.type,
    required this.subject,
    required this.className,
    required this.term,
    required this.maxScore,
    required this.weight,
    this.dueAt,
    required this.markedCount,
  });

  factory TeacherAssessmentModel.fromJson(Map<String, dynamic> json) {
    return TeacherAssessmentModel(
      id: json['id'] as int? ?? 0,
      title: json['title'] as String? ?? 'Assessment',
      type: json['type'] as String? ?? 'Quiz',
      subject: json['subject'] as String? ?? '',
      className: json['class_name'] as String? ?? '',
      term: json['term'] as String? ?? '',
      maxScore: (json['max_score'] as num?)?.toDouble() ?? 100.0,
      weight: (json['weight'] as num?)?.toDouble() ?? 1.0,
      dueAt: json['due_at'] as String?,
      markedCount: (json['marked_count'] as num?)?.toInt() ?? 0,
    );
  }
}

