import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../shared/widgets/user_avatar.dart';
import '../../data/models/portal_message_model.dart';
import '../../state/communication_state.dart';
import 'compose_message_screen.dart';

class MessagesInboxScreen extends ConsumerStatefulWidget {
  const MessagesInboxScreen({super.key});

  @override
  ConsumerState<MessagesInboxScreen> createState() => _MessagesInboxScreenState();
}

class _MessagesInboxScreenState extends ConsumerState<MessagesInboxScreen> {
  String _filter = 'all';
  String _searchQuery = '';

  @override
  Widget build(BuildContext context) {
    final messagesAsync = ref.watch(portalMessagesProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Direct Messages',
              style: TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
            ),
            SizedBox(height: 1),
            Text(
              'Teacher & Guardian Communication',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: Color(0xFF64748B),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: Color(0xFF0F172A)),
            onPressed: () => ref.read(portalMessagesProvider.notifier).refresh(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF0F172A),
        foregroundColor: Colors.white,
        elevation: 4,
        icon: const Icon(Icons.edit_note_rounded, color: Color(0xFFE2F952)),
        label: const Text(
          'Compose',
          style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 0.3),
        ),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const ComposeMessageScreen()),
          );
        },
      ),
      body: messagesAsync.when(
        data: (messages) {
          final filtered = messages.where((m) {
            // Filter capsule
            if (_filter == 'unread' && (m.isSender || m.isRead)) return false;
            if (_filter == 'sent' && !m.isSender) return false;
            if (_filter == 'received' && m.isSender) return false;

            // Search query
            if (_searchQuery.isEmpty) return true;
            final q = _searchQuery.toLowerCase();
            return m.contactName.toLowerCase().contains(q) ||
                m.subject.toLowerCase().contains(q) ||
                m.body.toLowerCase().contains(q);
          }).toList();

          return Column(
            children: [
              // ─── Search Bar ──────────────────────────────────────────────
              Container(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
                color: Colors.white,
                child: TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: InputDecoration(
                    hintText: 'Search conversations...',
                    hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                    isDense: true,
                    filled: true,
                    fillColor: const Color(0xFFF1F5F9),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    prefixIcon: const Icon(Icons.search_rounded, size: 20, color: Color(0xFF64748B)),
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 16, color: Color(0xFF64748B)),
                            onPressed: () => setState(() => _searchQuery = ''),
                          )
                        : null,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),

              // ─── Filter Capsule Pills (Inspiration 76630efe2e8f58715e5234efa0876ae8) ─
              Container(
                width: double.infinity,
                padding: const EdgeInsets.only(bottom: 12),
                color: Colors.white,
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: [
                      _capsuleFilter('all', 'All (${messages.length})'),
                      const SizedBox(width: 8),
                      _capsuleFilter('unread', 'Unread (${messages.where((m) => !m.isSender && !m.isRead).length})'),
                      const SizedBox(width: 8),
                      _capsuleFilter('received', 'Received'),
                      const SizedBox(width: 8),
                      _capsuleFilter('sent', 'Sent'),
                    ],
                  ),
                ),
              ),
              const Divider(height: 1, color: Color(0xFFE2E8F0)),

              // ─── Messages List ───────────────────────────────────────────
              Expanded(
                child: filtered.isEmpty
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.chat_bubble_outline_rounded, size: 48, color: Color(0xFF94A3B8)),
                              const SizedBox(height: 12),
                              const Text(
                                'No conversations found',
                                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15, color: Color(0xFF0F172A)),
                              ),
                              const SizedBox(height: 4),
                              const Text(
                                'Start a discussion with a class teacher or administrator.',
                                textAlign: TextAlign.center,
                                style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                              ),
                              const SizedBox(height: 18),
                              ElevatedButton.icon(
                                icon: const Icon(Icons.edit_note_rounded, size: 18),
                                label: const Text('Start Conversation'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF0F172A),
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                ),
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(builder: (_) => const ComposeMessageScreen()),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: () async => ref.read(portalMessagesProvider.notifier).refresh(),
                        child: ListView.separated(
                          padding: const EdgeInsets.fromLTRB(16, 16, 16, 88),
                          itemCount: filtered.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 10),
                          itemBuilder: (context, index) {
                            final m = filtered[index];
                            return _MessageThreadCard(message: m);
                          },
                        ),
                      ),
              ),
            ],
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(color: Color(0xFF0F172A)),
        ),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline_rounded, size: 48, color: Color(0xFFEF4444)),
                const SizedBox(height: 12),
                Text('Could not load messages: $err', textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.read(portalMessagesProvider.notifier).refresh(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0F172A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _capsuleFilter(String key, String label) {
    final isSelected = _filter == key;
    return GestureDetector(
      onTap: () => setState(() => _filter = key),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFE2E8F0),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: isSelected ? Colors.white : const Color(0xFF64748B),
          ),
        ),
      ),
    );
  }
}

class _MessageThreadCard extends StatelessWidget {
  final PortalMessageModel message;

  const _MessageThreadCard({required this.message});

  @override
  Widget build(BuildContext context) {
    final isUnreadIncoming = !message.isSender && !message.isRead;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isUnreadIncoming
              ? const Color(0xFF0F172A)
              : const Color(0xFFF1F5F9),
          width: isUnreadIncoming ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isUnreadIncoming ? 0.04 : 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showMessageDetail(context, message),
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Stack(
                      children: [
                        UserAvatar(
                          name: message.contactName,
                          radius: 20,
                        ),
                        Positioned(
                          right: 0,
                          bottom: 0,
                          child: Container(
                            width: 11,
                            height: 11,
                            decoration: BoxDecoration(
                              color: const Color(0xFF10B981),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                message.contactName,
                                style: TextStyle(
                                  fontWeight: isUnreadIncoming ? FontWeight.w900 : FontWeight.w700,
                                  fontSize: 14,
                                  color: const Color(0xFF0F172A),
                                ),
                              ),
                              if (isUnreadIncoming) ...[
                                const SizedBox(width: 6),
                                Container(
                                  width: 8,
                                  height: 8,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFFE2F952),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ],
                            ],
                          ),
                          if (message.studentName != null) ...[
                            const SizedBox(height: 2),
                            Text(
                              'Regarding: ${message.studentName}',
                              style: const TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF6366F1),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          message.dateFormatted,
                          style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
                        ),
                        if (message.isSender) ...[
                          const SizedBox(height: 2),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'Sent',
                              style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w700, color: Color(0xFF64748B)),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  message.subject,
                  style: TextStyle(
                    fontWeight: isUnreadIncoming ? FontWeight.w800 : FontWeight.w700,
                    fontSize: 14,
                    color: const Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  message.body,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 12.5, color: Color(0xFF475569), height: 1.4),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _showMessageDetail(BuildContext context, PortalMessageModel msg) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.4,
        maxChildSize: 0.9,
        expand: false,
        builder: (_, scrollController) => Padding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
          child: ListView(
            controller: scrollController,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Text(
                msg.subject,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                  height: 1.25,
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  UserAvatar(name: msg.senderName, radius: 18),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('From: ${msg.senderName}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                        Text('To: ${msg.recipientName}', style: const TextStyle(fontSize: 11, color: Color(0xFF64748B))),
                      ],
                    ),
                  ),
                  Text(msg.dateFormatted, style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                ],
              ),
              if (msg.studentName != null) ...[
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF2FF),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    'Student: ${msg.studentName}',
                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF4F46E5)),
                  ),
                ),
              ],
              const Divider(height: 28),
              Text(
                msg.body,
                style: const TextStyle(fontSize: 14, height: 1.6, color: Color(0xFF1E293B)),
              ),
              const SizedBox(height: 28),
              ElevatedButton.icon(
                icon: const Icon(Icons.reply_rounded, size: 18),
                label: const Text('Reply to this message'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0F172A),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                onPressed: () {
                  Navigator.pop(ctx);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => const ComposeMessageScreen(),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
