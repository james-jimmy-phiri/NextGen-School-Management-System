import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/app_button.dart';
import '../../data/models/portal_message_model.dart';
import '../../state/communication_state.dart';

class ComposeMessageScreen extends ConsumerStatefulWidget {
  const ComposeMessageScreen({super.key});

  @override
  ConsumerState<ComposeMessageScreen> createState() => _ComposeMessageScreenState();
}

class _ComposeMessageScreenState extends ConsumerState<ComposeMessageScreen> {
  final _formKey = GlobalKey<FormState>();
  final _subjectController = TextEditingController();
  final _bodyController = TextEditingController();

  ContactModel? _selectedContact;
  bool _isSending = false;

  @override
  void dispose() {
    _subjectController.dispose();
    _bodyController.dispose();
    super.dispose();
  }

  void _onSend() async {
    if (!(_formKey.currentState?.validate() ?? false) || _selectedContact == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a recipient and complete the fields.')),
      );
      return;
    }

    setState(() => _isSending = true);

    try {
      await ref.read(portalMessagesProvider.notifier).sendMessage(
            toUserId: _selectedContact!.id,
            subject: _subjectController.text.trim(),
            body: _bodyController.text.trim(),
          );

      if (mounted) {
        setState(() => _isSending = false);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Message sent successfully!'),
            backgroundColor: AppTheme.success,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSending = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to send message: $e'),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final contactsAsync = ref.watch(messageContactsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('New Message'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // ─── Recipient Dropdown ────────────────────────────────────────
              contactsAsync.when(
                data: (contacts) {
                  return DropdownButtonFormField<ContactModel>(
                    decoration: const InputDecoration(
                      labelText: 'Select Recipient',
                      prefixIcon: Icon(Icons.person_outline),
                    ),
                    initialValue: _selectedContact,
                    items: contacts.map((c) {
                      return DropdownMenuItem<ContactModel>(
                        value: c,
                        child: Text('${c.name} (${c.role})'),
                      );
                    }).toList(),
                    onChanged: (val) {
                      setState(() => _selectedContact = val);
                    },
                    validator: (val) => val == null ? 'Please select a recipient' : null,
                  );
                },
                loading: () => const LinearProgressIndicator(),
                error: (err, _) => Text('Could not load contacts: $err'),
              ),
              const SizedBox(height: 16),

              // ─── Subject Field ─────────────────────────────────────────────
              TextFormField(
                controller: _subjectController,
                decoration: const InputDecoration(
                  labelText: 'Subject',
                  hintText: 'e.g. Question regarding homework or fee payment',
                  prefixIcon: Icon(Icons.title),
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Please enter a subject';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // ─── Message Body ──────────────────────────────────────────────
              TextFormField(
                controller: _bodyController,
                maxLines: 8,
                decoration: const InputDecoration(
                  labelText: 'Message Body',
                  hintText: 'Type your message here...',
                  alignLabelWithHint: true,
                ),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return 'Please enter your message';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),

              // ─── Send Button ───────────────────────────────────────────────
              AppButton(
                text: 'Send Message',
                isLoading: _isSending,
                icon: Icons.send,
                onPressed: _onSend,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

