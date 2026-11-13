import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../data/models/calendar_event_model.dart';
import '../../state/communication_state.dart';

class SchoolCalendarScreen extends ConsumerWidget {
  const SchoolCalendarScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final eventsAsync = ref.watch(calendarEventsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('School Calendar', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            Text('Events, Exams & Holidays', style: TextStyle(fontSize: 11, color: AppTheme.textMutedLight)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.refresh(calendarEventsProvider),
          ),
        ],
      ),
      body: eventsAsync.when(
        data: (events) {
          if (events.isEmpty) {
            return const Center(
              child: Text('No school calendar events posted.', style: TextStyle(color: AppTheme.textMutedLight)),
            );
          }

          return RefreshIndicator(
            onRefresh: () async => ref.refresh(calendarEventsProvider),
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: events.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final e = events[index];
                return _EventCard(event: e);
              },
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.error_outline, size: 48, color: AppTheme.error),
                const SizedBox(height: 12),
                Text('Could not load school calendar: $err', textAlign: TextAlign.center),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.refresh(calendarEventsProvider),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _EventCard extends StatelessWidget {
  final CalendarEventModel event;

  const _EventCard({required this.event});

  @override
  Widget build(BuildContext context) {
    Color typeColor;
    IconData typeIcon;

    switch (event.eventType.toLowerCase()) {
      case 'exam':
        typeColor = const Color(0xFFE11D48);
        typeIcon = Icons.fact_check_outlined;
        break;
      case 'holiday':
        typeColor = const Color(0xFF059669);
        typeIcon = Icons.beach_access_outlined;
        break;
      case 'sports':
        typeColor = const Color(0xFFD97706);
        typeIcon = Icons.sports_soccer_outlined;
        break;
      default:
        typeColor = AppTheme.primary;
        typeIcon = Icons.event_note_outlined;
    }

    final isSingleDay = event.startDate == event.endDate || event.endDate.isEmpty;

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppTheme.borderLight),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: typeColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(typeIcon, color: typeColor, size: 24),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: typeColor.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          event.eventType.toUpperCase(),
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: typeColor,
                          ),
                        ),
                      ),
                      const Spacer(),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 12, color: AppTheme.textMutedLight),
                          const SizedBox(width: 4),
                          Text(
                            isSingleDay ? event.startDate : '${event.startDate} to ${event.endDate}',
                            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textMutedLight),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    event.title,
                    style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                  ),
                  if (event.description != null && event.description!.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      event.description!,
                      style: const TextStyle(fontSize: 13, color: Color(0xFF475569), height: 1.4),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

