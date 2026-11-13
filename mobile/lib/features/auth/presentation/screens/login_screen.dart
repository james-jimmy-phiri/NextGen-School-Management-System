import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../state/auth_state.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  final _customUrlController = TextEditingController();

  bool _obscurePassword = true;
  bool _showServerConfig = false;

  @override
  void initState() {
    super.initState();
    _identifierController.text = 'parent@horizon.demo';
    _passwordController.text = 'Demo#2026Pass';
  }

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    _customUrlController.dispose();
    super.dispose();
  }

  void _onSignIn() {
    if (_formKey.currentState?.validate() ?? false) {
      ref.read(authStateProvider.notifier).login(
            identifier: _identifierController.text,
            password: _passwordController.text,
          );
    }
  }

  void _fillPersona({required String identifier, required String roleLabel}) {
    setState(() {
      _identifierController.text = identifier;
      _passwordController.text = 'Demo#2026Pass';
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Loaded $roleLabel credentials'),
        duration: const Duration(seconds: 1),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final currentBaseUrl = ref.watch(apiBaseUrlProvider);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 24),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // ─── Header & Logo ───────────────────────────────────────────────
                  Center(
                    child: Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        color: AppTheme.primary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppTheme.primaryLight.withValues(alpha: 0.3)),
                      ),
                      child: const Icon(
                        Icons.school_rounded,
                        size: 40,
                        color: AppTheme.primary,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Text(
                    'NextGen School OS',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.textMainLight,
                      letterSpacing: -0.5,
                    ),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Guardian & Staff Mobile Companion',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.textMutedLight,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // ─── Error Notification ──────────────────────────────────────────
                  if (authState.errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppTheme.error.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppTheme.error.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.error_outline, color: AppTheme.error, size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              authState.errorMessage!,
                              style: const TextStyle(
                                color: AppTheme.error,
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                  ],

                  // ─── Credentials Fields ──────────────────────────────────────────
                  TextFormField(
                    controller: _identifierController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: const InputDecoration(
                      labelText: 'Email address or Phone number',
                      hintText: 'e.g. parent@horizon.demo or +265...',
                      prefixIcon: Icon(Icons.person_outline),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'Please enter your email or phone number';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  TextFormField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    decoration: InputDecoration(
                      labelText: 'Password',
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword ? Icons.visibility_off : Icons.visibility,
                          color: AppTheme.textMutedLight,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                    ),
                    validator: (val) {
                      if (val == null || val.isEmpty) {
                        return 'Please enter your password';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),

                  // ─── Sign In Button ──────────────────────────────────────────────
                  AppButton(
                    text: 'Sign In',
                    isLoading: authState.isLoading,
                    icon: Icons.login,
                    onPressed: _onSignIn,
                  ),
                  const SizedBox(height: 28),

                  // ─── Quick Persona Switcher ──────────────────────────────────────
                  const Row(
                    children: [
                      Expanded(child: Divider()),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 10),
                        child: Text(
                          'DEMO PERSONAS',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.textMutedLight,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ),
                      Expanded(child: Divider()),
                    ],
                  ),
                  const SizedBox(height: 14),

                  Wrap(
                    spacing: 8,
                    alignment: WrapAlignment.center,
                    children: [
                      ActionChip(
                        avatar: const Icon(Icons.family_restroom, size: 16, color: Color(0xFF0284C7)),
                        label: const Text('Parent'),
                        onPressed: () => _fillPersona(
                          identifier: 'parent@horizon.demo',
                          roleLabel: 'Parent',
                        ),
                      ),
                      ActionChip(
                        avatar: const Icon(Icons.school, size: 16, color: Color(0xFF059669)),
                        label: const Text('Teacher'),
                        onPressed: () => _fillPersona(
                          identifier: 'teacher@horizon.demo',
                          roleLabel: 'Teacher',
                        ),
                      ),
                      ActionChip(
                        avatar: const Icon(Icons.shield, size: 16, color: Color(0xFF7C3AED)),
                        label: const Text('School Admin'),
                        onPressed: () => _fillPersona(
                          identifier: 'admin@horizon.demo',
                          roleLabel: 'School Admin',
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // ─── Server Configuration Drawer / Toggle ────────────────────────
                  Center(
                    child: TextButton.icon(
                      style: TextButton.styleFrom(
                        foregroundColor: AppTheme.textMutedLight,
                      ),
                      icon: Icon(
                        _showServerConfig ? Icons.expand_less : Icons.tune,
                        size: 16,
                      ),
                      label: Text(
                        _showServerConfig ? 'Hide Server Settings' : 'Server Connection ($currentBaseUrl)',
                        style: const TextStyle(fontSize: 12),
                      ),
                      onPressed: () {
                        setState(() {
                          _showServerConfig = !_showServerConfig;
                          if (_showServerConfig) {
                            _customUrlController.text = currentBaseUrl;
                          }
                        });
                      },
                    ),
                  ),

                  if (_showServerConfig) ...[
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.borderLight),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'API Server Base URL',
                            style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: _customUrlController,
                            decoration: const InputDecoration(
                              hintText: 'http://192.168.1.X:8000/api/v1',
                              isDense: true,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Wrap(
                            spacing: 8,
                            runSpacing: 6,
                            children: [
                              OutlinedButton(
                                onPressed: () {
                                  const url = 'http://192.168.1.167:8000/api/v1';
                                  ref.read(apiBaseUrlProvider.notifier).state = url;
                                  _customUrlController.text = url;
                                },
                                child: const Text('192.168.1.167'),
                              ),
                              OutlinedButton(
                                onPressed: () {
                                  const url = 'http://10.0.2.2:8000/api/v1';
                                  ref.read(apiBaseUrlProvider.notifier).state = url;
                                  _customUrlController.text = url;
                                },
                                child: const Text('Emulator'),
                              ),
                              ElevatedButton(
                                onPressed: () {
                                  if (_customUrlController.text.trim().isNotEmpty) {
                                    ref.read(apiBaseUrlProvider.notifier).state =
                                        _customUrlController.text.trim();
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('API URL updated')),
                                    );
                                  }
                                },
                                child: const Text('Apply'),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

