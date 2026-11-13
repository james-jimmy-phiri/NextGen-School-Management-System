class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final Map<String, dynamic>? errors;

  const ApiException({
    required this.message,
    this.statusCode,
    this.errors,
  });

  @override
  String toString() => 'ApiException(statusCode: $statusCode, message: $message)';

  /// Extracts user-friendly error message from dynamic API response
  factory ApiException.fromDioError(dynamic error) {
    if (error is! Exception) {
      return const ApiException(message: 'An unexpected error occurred.');
    }

    try {
      // ignore: avoid_dynamic_calls
      final response = (error as dynamic).response;
      if (response != null) {
        final data = response.data;
        final statusCode = response.statusCode as int?;

        if (data is Map<String, dynamic>) {
          final message = data['message'] as String? ??
              data['error'] as String? ??
              'Server returned error ($statusCode)';
          
          final errors = data['errors'] as Map<String, dynamic>?;

          return ApiException(
            message: message,
            statusCode: statusCode,
            errors: errors,
          );
        }

        return ApiException(
          message: 'Server returned HTTP $statusCode',
          statusCode: statusCode,
        );
      }
    } catch (_) {}

    return const ApiException(
      message: 'Network connection failed. Please check your internet connection.',
    );
  }
}

