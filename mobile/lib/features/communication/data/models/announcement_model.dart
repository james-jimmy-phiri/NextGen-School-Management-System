class AnnouncementModel {
  final int id;
  final String title;
  final String body;
  final List<String> audience;
  final String authorName;
  final String deliveryChannel;
  final bool isUrgent;
  final String createdAt;
  final String dateFormatted;

  const AnnouncementModel({
    required this.id,
    required this.title,
    required this.body,
    this.audience = const ['all'],
    required this.authorName,
    this.deliveryChannel = 'portal',
    this.isUrgent = false,
    required this.createdAt,
    required this.dateFormatted,
  });

  factory AnnouncementModel.fromJson(Map<String, dynamic> json) {
    List<String> parseAudience(dynamic aud) {
      if (aud is List) return aud.map((e) => e.toString()).toList();
      return ['all'];
    }

    return AnnouncementModel(
      id: json['id'] as int? ?? 0,
      title: json['title'] as String? ?? 'Notice',
      body: json['body'] as String? ?? '',
      audience: parseAudience(json['audience']),
      authorName: json['author_name'] as String? ?? 'School Administration',
      deliveryChannel: json['delivery_channel'] as String? ?? 'portal',
      isUrgent: json['is_urgent'] as bool? ?? false,
      createdAt: json['created_at'] as String? ?? '',
      dateFormatted: json['date_formatted'] as String? ?? '',
    );
  }
}

