import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../shared/widgets/status_badge.dart';
import '../../data/models/child_attendance_model.dart';
import '../../data/models/child_model.dart';
import '../../state/parent_portal_state.dart';

class ChildAttendanceScreen extends ConsumerStatefulWidget {
  final ChildModel child;

  const ChildAttendanceScreen({
    super.key,
    required this.child,
  });

  @override
  ConsumerState<ChildAttendanceScreen> createState() => _ChildAttendanceScreenState();
}

class _ChildAttendanceScreenState extends ConsumerState<ChildAttendanceScreen> {
  String _selectedFilter = 'all';

  @override
  Widget build(BuildContext context) {
    final attendanceAsync = ref.watch(childAttendanceProvider(widget.child.id));

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${widget.child.firstName}\'s Attendance',
              style: const TextStyle(
                fontSize: 17,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 1),
            Text(
              '${widget.child.className} · Roll Call Ledger',
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: Color(0xFF64748B),
              ),
            ),
          ],
        ),
      ),
      body: attendanceAsync.when(
        data: (attendanceData) => _buildContent(context, attendanceData),
        loading: () => const Center(
          child: CircularProgressIndicator(color: Color(0xFF0F172A)),
        ),
        error: (err, _) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.wifi_off_rounded, size: 48, color: Color(0xFF94A3B8)),
                const SizedBox(height: 12),
                Text(
                  'Could not load attendance: $err',
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Color(0xFF64748B), fontSize: 13),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: () => ref.refresh(childAttendanceProvider(widget.child.id)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0F172A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('Try Again'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContent(BuildContext context, ChildAttendanceData data) {
    final filteredRecords = _selectedFilter == 'all'
        ? data.records
        : data.records.where((r) => r.status.toLowerCase() == _selectedFilter).toList();

    final pctColor = data.percentage >= 90
        ? const Color(0xFF10B981)
        : (data.percentage >= 80 ? const Color(0xFFF59E0B) : const Color(0xFFEF4444));

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(childAttendanceProvider(widget.child.id));
      },
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
        children: [
          // ─── Hero Attendance Overview Banner ──────────────────────────────
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(22),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF0F172A).withValues(alpha: 0.15),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Text(
                            'TERM ATTENDANCE',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFFE2F952),
                              letterSpacing: 0.6,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            Text(
                              '${data.percentage}%',
                              style: const TextStyle(
                                fontSize: 38,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                                letterSpacing: -1,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              data.percentage >= 90 ? 'Excellent' : (data.percentage >= 80 ? 'Good' : 'Needs Attention'),
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: pctColor,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Container(
                      width: 58,
                      height: 58,
                      decoration: BoxDecoration(
                        color: const Color(0xFFE2F952).withValues(alpha: 0.15),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: const Color(0xFFE2F952).withValues(alpha: 0.3),
                          width: 2,
                        ),
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.verified_rounded,
                          color: Color(0xFFE2F952),
                          size: 30,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 18),

                // ─── 4 Mini Attendance Metric Cards (Inspiration Matrix) ────
                Row(
                  children: [
                    Expanded(
                      child: _MetricMiniCard(
                        label: 'Present',
                        count: data.present,
                        color: const Color(0xFF10B981),
                        bgColor: const Color(0xFF10B981).withValues(alpha: 0.15),
                        icon: Icons.check_circle_outline_rounded,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _MetricMiniCard(
                        label: 'Late',
                        count: data.late,
                        color: const Color(0xFFF59E0B),
                        bgColor: const Color(0xFFF59E0B).withValues(alpha: 0.15),
                        icon: Icons.access_time_rounded,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _MetricMiniCard(
                        label: 'Absent',
                        count: data.absent,
                        color: const Color(0xFFEF4444),
                        bgColor: const Color(0xFFEF4444).withValues(alpha: 0.15),
                        icon: Icons.cancel_outlined,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _MetricMiniCard(
                        label: 'Excused',
                        count: data.excused,
                        color: const Color(0xFF38BDF8),
                        bgColor: const Color(0xFF38BDF8).withValues(alpha: 0.15),
                        icon: Icons.info_outline_rounded,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 22),

          // ─── Filter Capsule Pills (76630efe2e8f58715e5234efa0876ae8 inspiration) ─
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _capsuleFilter('all', 'All (${data.records.length})'),
                const SizedBox(width: 8),
                _capsuleFilter('present', 'Present (${data.present})'),
                const SizedBox(width: 8),
                _capsuleFilter('late', 'Late (${data.late})'),
                const SizedBox(width: 8),
                _capsuleFilter('absent', 'Absent (${data.absent})'),
                const SizedBox(width: 8),
                _capsuleFilter('excused', 'Excused (${data.excused})'),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // ─── Daily Records Header ─────────────────────────────────────────
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Attendance History (${filteredRecords.length})',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF0F172A),
                ),
              ),
              const Text(
                'Latest first',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFF94A3B8),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // ─── Daily Records List ──────────────────────────────────────────
          if (filteredRecords.isEmpty)
            Container(
              padding: const EdgeInsets.symmetric(vertical: 48),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Column(
                children: [
                  const Icon(Icons.event_busy_rounded, size: 40, color: Color(0xFF94A3B8)),
                  const SizedBox(height: 8),
                  Text(
                    'No ${_selectedFilter == 'all' ? '' : _selectedFilter} records found',
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF64748B),
                    ),
                  ),
                ],
              ),
            )
          else
            ...filteredRecords.map((record) => _buildRecordCard(record)),
        ],
      ),
    );
  }

  Widget _capsuleFilter(String key, String label) {
    final isSelected = _selectedFilter == key;
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedFilter = key;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0F172A) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFE2E8F0),
            width: 1.2,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFF0F172A).withValues(alpha: 0.15),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ]
              : null,
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

  Widget _buildRecordCard(AttendanceRecordItem record) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const Icon(
              Icons.calendar_month_rounded,
              size: 20,
              color: Color(0xFF475569),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  record.date,
                  style: const TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 14,
                    color: Color(0xFF0F172A),
                  ),
                ),
                const SizedBox(height: 3),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        record.session.toUpperCase(),
                        style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF475569),
                          letterSpacing: 0.4,
                        ),
                      ),
                    ),
                    if (record.remarks != null && record.remarks!.isNotEmpty) ...[
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          record.remarks!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 11,
                            color: Color(0xFF94A3B8),
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          StatusBadge.forAttendance(record.status),
        ],
      ),
    );
  }
}

class _MetricMiniCard extends StatelessWidget {
  final String label;
  final int count;
  final Color color;
  final Color bgColor;
  final IconData icon;

  const _MetricMiniCard({
    required this.label,
    required this.count,
    required this.color,
    required this.bgColor,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(height: 6),
          Text(
            '$count',
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: Colors.white70,
            ),
          ),
        ],
      ),
    );
  }
}
