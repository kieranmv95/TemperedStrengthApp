import React from 'react';
import { Text, View } from 'react-native';
import { articleScreenStyles as styles } from './articleScreenStyles';

function renderInlineFormatting(text: string, baseStyle: object) {
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
}

type ArticleMarkdownContentProps = {
  content: string;
};

export function ArticleMarkdownContent({
  content,
}: ArticleMarkdownContentProps) {
  const lines = content.split('\n');
  return lines.map((rawLine, index) => {
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      return (
        <Text key={index} style={styles.heading2}>
          {line.replace('## ', '')}
        </Text>
      );
    }
    if (line.startsWith('### ')) {
      return (
        <Text key={index} style={styles.heading3}>
          {line.replace('### ', '')}
        </Text>
      );
    }
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
    if (line === '') {
      return <View key={index} style={styles.spacer} />;
    }
    return (
      <Text key={index} style={styles.paragraph}>
        {renderInlineFormatting(line, styles.paragraph)}
      </Text>
    );
  });
}
