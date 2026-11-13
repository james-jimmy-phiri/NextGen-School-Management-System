class TimetableSlot {
  final String day;
  final String time;
  final String subject;
  final String room;
  final String teacher;

  const TimetableSlot({
    required this.day,
    required this.time,
    required this.subject,
    required this.room,
    required this.teacher,
  });

  factory TimetableSlot.fromJson(Map<String, dynamic> json) {
    return TimetableSlot(
      day: json['day'] as String? ?? 'Monday',
      time: json['time'] as String? ?? '',
      subject: json['subject'] as String? ?? '',
      room: json['room'] as String? ?? '',
      teacher: json['teacher'] as String? ?? '',
    );
  }
}

class ChildTimetableData {
  final List<TimetableSlot> slots;

  const ChildTimetableData({
    required this.slots,
  });

  factory ChildTimetableData.fromJson(Map<String, dynamic> json) {
    final rawSlots = json['periods'] as List<dynamic>? ?? [];

    return ChildTimetableData(
      slots: rawSlots
          .map((s) => TimetableSlot.fromJson(s as Map<String, dynamic>))
          .toList(),
    );
  }

  List<TimetableSlot> slotsForDay(String dayName) {
    return slots
        .where((s) => s.day.toLowerCase() == dayName.toLowerCase())
        .toList();
  }
}

