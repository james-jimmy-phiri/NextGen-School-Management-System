class CalendarEventModel {
  final int id;
  final String title;
  final String? description;
  final String eventType;
  final String startDate;
  final String endDate;
  final bool isHoliday;

  const CalendarEventModel({
    required this.id,
    required this.title,
    this.description,
    required this.eventType,
    required this.startDate,
    required this.endDate,
    required this.isHoliday,
  });

  factory CalendarEventModel.fromJson(Map<String, dynamic> json) {
    return CalendarEventModel(
      id: json['id'] as int? ?? 0,
      title: json['title'] as String? ?? 'Event',
      description: json['description'] as String?,
      eventType: json['event_type'] as String? ?? 'academic',
      startDate: json['start_date'] as String? ?? '',
      endDate: json['end_date'] as String? ?? json['start_date'] as String? ?? '',
      isHoliday: json['is_holiday'] as bool? ?? false,
    );
  }
}

