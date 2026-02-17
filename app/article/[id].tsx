import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '@/src/constants/theme';
import { getArticleById } from '@/src/data/brief';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = id ? getArticleById(id) : undefined;

  if (!article) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Parse inline bold text (**text**) within a string
  const renderInlineFormatting = (text: string, baseStyle: object) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={i} style={[baseStyle, styles.inlineBold]}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return (
        <Text key={i} style={baseStyle}>
          {part}
        </Text>
      );
    });
  };

  // Simple markdown-like rendering for content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((rawLine, index) => {
      // Trim leading/trailing whitespace from each line
      const line = rawLine.trim();

      // H2 Headers
      if (line.startsWith('## ')) {
        return (
          <Text key={index} style={styles.heading2}>
            {line.replace('## ', '')}
          </Text>
        );
      }
      // H3 Headers
      if (line.startsWith('### ')) {
        return (
          <Text key={index} style={styles.heading3}>
            {line.replace('### ', '')}
          </Text>
        );
      }
      // List items
      if (line.startsWith('- ')) {
        const listContent = line.replace('- ', '');
        return (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>
              {renderInlineFormatting(listContent, styles.listText)}
            </Text>
          </View>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        const [num, ...rest] = line.split('. ');
        const listContent = rest.join('. ');
        return (
          <View key={index} style={styles.listItem}>
            <Text style={styles.numberBullet}>{num}.</Text>
            <Text style={styles.listText}>
              {renderInlineFormatting(listContent, styles.listText)}
            </Text>
          </View>
        );
      }
      // Empty lines
      if (line === '') {
        return <View key={index} style={styles.spacer} />;
      }
      // Regular paragraphs (with inline bold support)
      return (
        <Text key={index} style={styles.paragraph}>
          {renderInlineFormatting(line, styles.paragraph)}
        </Text>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {article.category}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <Image source={{ uri: article.image }} style={styles.heroImage} />

        {/* Article Meta */}
        <View style={styles.metaContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
          <View style={styles.readTime}>
            <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.readTimeText}>{article.readTime} min read</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.subtitle}>{article.subtitle}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Content */}
        <View style={styles.articleContent}>
          {renderContent(article.content)}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  headerBackButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.backgroundElevated,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.xxxl,
    paddingTop: Spacing.xxxl,
  },
  categoryBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  readTimeText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
    lineHeight: 34,
    paddingHorizontal: Spacing.xxxl,
    marginTop: Spacing.xxl,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.xxl,
    lineHeight: 24,
    paddingHorizontal: Spacing.xxxl,
    marginTop: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderDefault,
    marginHorizontal: Spacing.xxxl,
    marginVertical: Spacing.section,
  },
  articleContent: {
    paddingHorizontal: Spacing.xxxl,
  },
  heading2: {
    color: Colors.accent,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    marginTop: Spacing.section,
    marginBottom: Spacing.xl,
  },
  heading3: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  paragraph: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 26,
    marginBottom: Spacing.xs,
  },
  inlineBold: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingLeft: Spacing.md,
  },
  bullet: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    lineHeight: 26,
    marginRight: Spacing.xl,
  },
  numberBullet: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '600',
    lineHeight: 26,
    marginRight: Spacing.md,
    width: 24,
  },
  listText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 26,
  },
  spacer: {
    height: Spacing.xl,
  },
  bottomSpacer: {
    height: 40,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.textMuted,
    fontSize: FontSize.displaySm,
    marginBottom: Spacing.xxl,
  },
  backButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  backButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
