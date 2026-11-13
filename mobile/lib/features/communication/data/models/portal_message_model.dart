class ContactModel {
  final int id;
  final String name;
  final String? email;
  final String role;

  const ContactModel({
    required this.id,
    required this.name,
    this.email,
    required this.role,
  });

  factory ContactModel.fromJson(Map<String, dynamic> json) {
    return ContactModel(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? 'Contact',
      email: json['email'] as String?,
      role: json['role'] as String? ?? 'Staff',
    );
  }
}

class PortalMessageModel {
  final int id;
  final int fromUserId;
  final String senderName;
  final int toUserId;
  final String recipientName;
  final String contactName;
  final String? studentName;
  final String subject;
  final String body;
  final bool isSender;
  final bool isRead;
  final String? readAt;
  final String createdAt;
  final String dateFormatted;

  const PortalMessageModel({
    required this.id,
    required this.fromUserId,
    required this.senderName,
    required this.toUserId,
    required this.recipientName,
    required this.contactName,
    this.studentName,
    required this.subject,
    required this.body,
    required this.isSender,
    required this.isRead,
    this.readAt,
    required this.createdAt,
    required this.dateFormatted,
  });

  factory PortalMessageModel.fromJson(Map<String, dynamic> json) {
    return PortalMessageModel(
      id: json['id'] as int? ?? 0,
      fromUserId: json['from_user_id'] as int? ?? 0,
      senderName: json['sender_name'] as String? ?? 'User',
      toUserId: json['to_user_id'] as int? ?? 0,
      recipientName: json['recipient_name'] as String? ?? 'Recipient',
      contactName: json['contact_name'] as String? ?? 'Contact',
      studentName: json['student_name'] as String?,
      subject: json['subject'] as String? ?? 'No Subject',
      body: json['body'] as String? ?? '',
      isSender: json['is_sender'] as bool? ?? false,
      isRead: json['is_read'] as bool? ?? true,
      readAt: json['read_at'] as String?,
      createdAt: json['created_at'] as String? ?? '',
      dateFormatted: json['date_formatted'] as String? ?? '',
    );
  }
}

