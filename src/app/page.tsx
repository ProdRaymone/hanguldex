import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-12 px-4 py-24 text-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="text-indigo-600 dark:text-indigo-400">Hangul</span>
          Dex
        </h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          韩语字符训练工具 — SRS 间隔重复 + 游戏化学习
        </p>
      </div>

      <div className="grid w-full max-w-md gap-4 sm:grid-cols-2">
        <Link
          href="/learn"
          className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 p-6 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-zinc-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-950"
        >
          <span className="text-3xl">ㄱㄴㄷ</span>
          <span className="text-sm font-medium">学习字母</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            40 个韩文字母
          </span>
        </Link>
        <Link
          href="/drill"
          className="flex flex-col items-center gap-2 rounded-xl border border-zinc-200 p-6 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-zinc-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-950"
        >
          <span className="text-3xl">Quiz</span>
          <span className="text-sm font-medium">刷题练习</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            5 种训练模式
          </span>
        </Link>
      </div>

      <div className="grid w-full max-w-lg grid-cols-2 gap-3 text-center text-sm sm:grid-cols-4">
        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900">
          <div className="text-lg font-semibold">14</div>
          <div className="text-xs text-zinc-500">基础辅音</div>
        </div>
        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900">
          <div className="text-lg font-semibold">10</div>
          <div className="text-xs text-zinc-500">基础元音</div>
        </div>
        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900">
          <div className="text-lg font-semibold">5</div>
          <div className="text-xs text-zinc-500">双辅音</div>
        </div>
        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900">
          <div className="text-lg font-semibold">11</div>
          <div className="text-xs text-zinc-500">复合元音</div>
        </div>
      </div>
    </div>
  );
}
