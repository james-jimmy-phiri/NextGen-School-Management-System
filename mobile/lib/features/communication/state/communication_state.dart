import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/communication_repository.dart';
import '../data/models/announcement_model.dart';
import '../data/models/calendar_event_model.dart';
import '../data/models/portal_message_model.dart';

/// School announcements feed
final announcementsProvider = FutureProvider<List<AnnouncementModel>>((ref) async {
  final repo = ref.watch(communicationRepositoryProvider);
  return repo.getAnnouncements();
});

/// School calendar events
final calendarEventsProvider = FutureProvider<List<CalendarEventModel>>((ref) async {
  final repo = ref.watch(communicationRepositoryProvider);
  return repo.getEvents();
});

/// Direct messages list
final portalMessagesProvider =
    AsyncNotifierProvider<PortalMessagesNotifier, List<PortalMessageModel>>(
  PortalMessagesNotifier.new,
);

class PortalMessagesNotifier extends AsyncNotifier<List<PortalMessageModel>> {
  @override
  Future<List<PortalMessageModel>> build() async {
    final repo = ref.watch(communicationRepositoryProvider);
    return repo.getMessages();
  }

  Future<void> refresh() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final repo = ref.read(communicationRepositoryProvider);
      return repo.getMessages();
    });
  }

  Future<void> sendMessage({
    required int toUserId,
    required String subject,
    required String body,
    int? studentId,
  }) async {
    final repo = ref.read(communicationRepositoryProvider);
    await repo.sendMessage(
      toUserId: toUserId,
      subject: subject,
      body: body,
      studentId: studentId,
    );
    await refresh();
  }
}

/// Messageable contacts
final messageContactsProvider = FutureProvider<List<ContactModel>>((ref) async {
  final repo = ref.watch(communicationRepositoryProvider);
  return repo.getContacts();
});

/// Unread messages counter
final unreadMessagesCountProvider = Provider<int>((ref) {
  final messagesAsync = ref.watch(portalMessagesProvider);
  return messagesAsync.when(
    data: (messages) => messages.where((m) => !m.isSender && !m.isRead).length,
    loading: () => 0,
    error: (_, __) => 0,
  );
});

