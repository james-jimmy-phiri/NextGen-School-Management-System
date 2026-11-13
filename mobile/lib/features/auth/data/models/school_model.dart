class SchoolModel {
  final int id;
  final String name;
  final String? slug;
  final String? city;
  final String? country;

  const SchoolModel({
    required this.id,
    required this.name,
    this.slug,
    this.city,
    this.country,
  });

  factory SchoolModel.fromJson(Map<String, dynamic> json) {
    return SchoolModel(
      id: json['id'] as int? ?? 0,
      name: json['name'] as String? ?? 'School',
      slug: json['slug'] as String?,
      city: json['city'] as String?,
      country: json['country'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      if (slug != null) 'slug': slug,
      if (city != null) 'city': city,
      if (country != null) 'country': country,
    };
  }
}

