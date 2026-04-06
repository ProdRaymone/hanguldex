import CharacterGrid from "@/components/shared/CharacterGrid";

export const metadata = {
  title: "学习字母 — HangulDex",
};

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">韩文字母 자모</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          点击字母查看详情并播放发音 · 共 40 个字母
        </p>
      </div>
      <CharacterGrid />
    </div>
  );
}
