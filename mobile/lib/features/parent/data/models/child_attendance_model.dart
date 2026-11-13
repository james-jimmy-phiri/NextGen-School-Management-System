class AttendanceRecordItem {
  final int id;
  final String date;
  final String status; // 'present', 'late', 'absent', 'excused'
  final String session; // 'morning', 'afternoon'
  final String? remarks;

  const AttendanceRecordItem({
    required this.id,
    required this.date,
    required this.status,
    required this.session,
    this.remarks,
  });

  factory AttendanceRecordItem.fromJson(Map<String, dynamic> json) {
    return AttendanceRecordItem(
      id: json['id'] as int? ?? 0,
      date: json['date'] as String? ?? '',
      status: json['status'] as String? ?? 'present',
      session: json['session'] as String? ?? 'morning',
      remarks: json['remarks'] as String?,
    );
  }
}

class ChildAttendanceData {
  final List<AttendanceRecordItem> records;
  final int present;
  final int late;
  final int absent;
  final int excused;
  final int total;
  final int percentage;

  const ChildAttendanceData({
    required this.records,
    required this.present,
    required this.late,
    required this.absent,
    required this.excused,
    required this.total,
    required this.percentage,
  });

  factory ChildAttendanceData.fromJson(Map<String, dynamic> json) {
    final rawRecords = json['records'] as List<dynamic>? ?? [];
    final summary = json['summary'] as Map<String, dynamic>? ?? {};

    return ChildAttendanceData(
      records: rawRecords
          .map((r) => AttendanceRecordItem.fromJson(r as Map<String, dynamic>))
          .toList(),
      present: (summary['present'] as num?)?.toInt() ?? 0,
      late: (summary['late'] as num?)?.toInt() ?? 0,
      absent: (summary['absent'] as num?)?.toInt() ?? 0,
      excused: (summary['excused'] as num?)?.toInt() ?? 0,
      total: (summary['total'] as num?)?.toInt() ?? 0,
      percentage: (summary['percentage'] as num?)?.toInt() ?? 100,
    );
  }
}

