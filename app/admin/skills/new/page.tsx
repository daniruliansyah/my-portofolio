"use client";

import { useActionState } from "react";
import { createSkill } from "../actions";
import { SubmitButton } from "../../_components/SubmitButton";
import Link from "next/link";

const initialState = { error: "" };

export default function NewSkillPage() {
  const [state, formAction] = useActionState(createSkill, initialState);

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/skills" className="text-gray-400 hover:text-white text-sm transition">
          ← Kembali
        </Link>
        <h1 className="text-2xl font-bold">Tambah Skill</h1>
      </div>

      <form action={formAction} className="bg-gray-900 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Nama Skill <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            required
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="e.g. Laravel, Python, PostgreSQL"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">
            Kategori <span className="text-red-400">*</span>
          </label>
          <input
            name="category"
            required
            list="category-suggestions"
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            placeholder="e.g. Framework, Language, Database"
          />
          <datalist id="category-suggestions">
            <option value="Language" />
            <option value="Framework" />
            <option value="Database" />
            <option value="Tool" />
            <option value="Platform" />
            <option value="Library" />
            <option value="DevOps" />
          </datalist>
        </div>

        {state?.error && (
          <p className="text-red-400 text-sm">{state.error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <SubmitButton label="Simpan Skill" />
          <Link
            href="/admin/skills"
            className="px-5 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white text-sm transition"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
