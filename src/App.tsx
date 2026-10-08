import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { MiniText, MiniView, Spacing } from '@exercise/mini-app-sdk';

const SECONDS_PER_STRETCH = 20;

const STRETCHES = [
  { name: 'Nghiêng cổ', emoji: '🙆', hint: 'Nghiêng đầu sang trái rồi phải, giữ đều' },
  { name: 'Xoay vai', emoji: '💪', hint: 'Xoay vai ra sau thật chậm' },
  { name: 'Kéo tay qua ngực', emoji: '🤸', hint: 'Đổi tay ở giữa hiệp' },
  { name: 'Gập người', emoji: '🙇', hint: 'Thả lỏng lưng, chạm tay xuống mũi chân' },
  { name: 'Mở hông', emoji: '🧘', hint: 'Ngồi bướm, ấn nhẹ hai gối xuống' },
  { name: 'Giãn bắp chân', emoji: '🦵', hint: 'Chống tay vào tường, đẩy gót xuống sàn' },
];

export function StretchReminderApp() {
  const [index, setIndex] = useState(-1);
  const [remaining, setRemaining] = useState(SECONDS_PER_STRETCH);
  const [running, setRunning] = useState(false);

  const finished = index >= STRETCHES.length;
  const current = index >= 0 && !finished ? STRETCHES[index] : null;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        setIndex((i) => {
          const next = i + 1;
          if (next >= STRETCHES.length) setRunning(false);
          return next;
        });
        return SECONDS_PER_STRETCH;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const start = () => {
    if (index < 0 || finished) {
      setIndex(0);
      setRemaining(SECONDS_PER_STRETCH);
      setRunning(true);
      return;
    }
    setRunning((r) => !r);
  };

  const skip = () => {
    setRemaining(SECONDS_PER_STRETCH);
    setIndex((i) => {
      const next = i + 1;
      if (next >= STRETCHES.length) setRunning(false);
      return next;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MiniView surface="surface" style={styles.hero}>
        {current ? (
          <>
            <MiniText style={styles.heroEmoji}>{current.emoji}</MiniText>
            <MiniText variant="subtitle">{current.name}</MiniText>
            <MiniText variant="small" tone="secondary" style={styles.center}>
              {current.hint}
            </MiniText>
            <MiniText style={styles.timer}>{remaining}s</MiniText>
          </>
        ) : (
          <>
            <MiniText style={styles.heroEmoji}>{finished ? '🎉' : '🧘'}</MiniText>
            <MiniText variant="subtitle">{finished ? 'Hoàn thành!' : 'Sẵn sàng giãn cơ'}</MiniText>
            <MiniText variant="small" tone="secondary">
              {STRETCHES.length} động tác × {SECONDS_PER_STRETCH}s
            </MiniText>
          </>
        )}
      </MiniView>

      <View style={styles.actions}>
        <Pressable onPress={start} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <MiniText style={styles.buttonText}>
            {running ? 'Tạm dừng' : current ? 'Tiếp tục' : finished ? 'Làm lại' : 'Bắt đầu'}
          </MiniText>
        </Pressable>
        {current ? (
          <Pressable onPress={skip}>
            <MiniText variant="link" tone="secondary">
              Bỏ qua động tác →
            </MiniText>
          </Pressable>
        ) : null}
      </View>

      {STRETCHES.map((stretch, i) => (
        <MiniView
          key={stretch.name}
          surface={i === index ? 'surfaceSelected' : 'surface'}
          style={[styles.row, i < index && styles.done]}>
          <MiniText style={styles.rowEmoji}>{stretch.emoji}</MiniText>
          <MiniText variant="smallBold" style={styles.rowName}>
            {stretch.name}
          </MiniText>
          <MiniText variant="small" tone="secondary">
            {i < index ? '✓' : `${SECONDS_PER_STRETCH}s`}
          </MiniText>
        </MiniView>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.one,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  heroEmoji: {
    fontSize: 56,
    lineHeight: 68,
  },
  center: {
    textAlign: 'center',
  },
  timer: {
    marginTop: Spacing.two,
    fontSize: 56,
    lineHeight: 64,
    fontWeight: 700,
    fontVariant: ['tabular-nums'],
  },
  actions: {
    alignItems: 'center',
    gap: Spacing.one,
    marginVertical: Spacing.two,
  },
  button: {
    backgroundColor: '#5856D6',
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: 999,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 700,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  rowEmoji: {
    fontSize: 24,
    lineHeight: 30,
  },
  rowName: {
    flex: 1,
  },
  done: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
