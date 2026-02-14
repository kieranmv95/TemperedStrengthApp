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
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
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
            <Ionicons name="time-outline" size={14} color="#888" />
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
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  headerBackButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#888',
    fontSize: 14,
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
    backgroundColor: '#2A2A2A',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryBadge: {
    backgroundColor: '#c9b072',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    color: '#121212',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readTimeText: {
    color: '#888',
    fontSize: 13,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginHorizontal: 20,
    marginVertical: 24,
  },
  articleContent: {
    paddingHorizontal: 20,
  },
  heading2: {
    color: '#c9b072',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  heading3: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    color: '#CCC',
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 4,
  },
  inlineBold: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    color: '#c9b072',
    fontSize: 16,
    lineHeight: 26,
    marginRight: 12,
  },
  numberBullet: {
    color: '#c9b072',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 26,
    marginRight: 8,
    width: 24,
  },
  listText: {
    flex: 1,
    color: '#CCC',
    fontSize: 16,
    lineHeight: 26,
  },
  spacer: {
    height: 12,
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
    color: '#888',
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: '#c9b072',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#121212',
    fontSize: 14,
    fontWeight: '700',
  },
});
