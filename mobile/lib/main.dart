import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(const ProviderScope(child: NextGenApp()));
}

final apiBaseProvider = Provider<String>(
  (_) => String.fromEnvironment('API_BASE_URL', defaultValue: 'http://localhost:8000/api/v1'),
);

class NextGenApp extends StatelessWidget {
  const NextGenApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NextGen School Companion',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF4338CA)),
        useMaterial3: true,
      ),
      home: const BootstrapScreen(),
    );
  }
}

class BootstrapScreen extends ConsumerWidget {
  const BootstrapScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final apiBase = ref.watch(apiBaseProvider);

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'NextGen School OS · Mobile Scaffold',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Text(
              'API base resolved to:',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            SelectableText(apiBase),
            const SizedBox(height: 28),
            const Text(
              '• Riverpod-powered view models aligned with Laravel API resources '
              '(auth, dashboards, learners, guardian messaging).\n'
              '• Hive CE stores attendance drafts + cached PDFs offline.\n'
              '• Dio interceptors hydrate Sanctum bearer tokens synced from Laravel.',
            ),
          ],
        ),
      ),
    );
  }
}
