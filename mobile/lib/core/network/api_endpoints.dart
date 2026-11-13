class ApiEndpoints {
  ApiEndpoints._();

  // Authentication
  static const String login = '/auth/login';
  static const String token = '/auth/token';
  static const String me = '/auth/me';
  static const String logout = '/auth/logout';

  // School Configuration (Public / Setup)
  static const String schoolProfile = '/school-setup/school-profile';
  static const String academicYears = '/school-setup/academic-years';
  static const String terms = '/school-setup/terms';
  static const String classes = '/school-setup/classes';
  static const String streams = '/school-setup/streams';
  static const String subjects = '/school-setup/subjects';

  // Attendance
  static const String attendanceSessions = '/attendance/sessions';
  static const String attendanceMark = '/attendance/mark';

  // Parent Portal APIs
  static const String portalChildren = '/portal/children';
  static String portalChildAttendance(int studentId) => '/portal/children/$studentId/attendance';
  static String portalChildAcademics(int studentId) => '/portal/children/$studentId/academics';
  static String portalChildFees(int studentId) => '/portal/children/$studentId/fees';
  static String portalChildTimetable(int studentId) => '/portal/children/$studentId/timetable';

  // Teacher Workspace APIs
  static const String teacherClasses = '/teacher/classes';
  static String teacherClassStudents(int classId) => '/teacher/classes/$classId/students';
  static const String teacherAttendanceSync = '/teacher/attendance/sync';
  static const String teacherAssessments = '/teacher/assessments';
  static String teacherSaveMarks(int assessmentId) => '/teacher/assessments/$assessmentId/marks';
  static const String teacherTimetable = '/teacher/timetable';

  // Communication, Messaging & Calendar APIs
  static const String announcements = '/communication/announcements';
  static const String calendarEvents = '/communication/events';
  static const String messages = '/communication/messages';
  static const String sendMessage = '/communication/messages';
  static const String contacts = '/communication/contacts';
  static String markMessageRead(int messageId) => '/communication/messages/$messageId/read';
}
