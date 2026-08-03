"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadImage, useMyImages } from "@/features/media/useMedia";
import { extractErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Upload, Plus, Check, Loader2, AlertCircle, GalleryVertical, FileImage, X } from "lucide-react";

/**
 * Multi-select image picker for a billboard's photo gallery: thumbnails with
 * a remove button, plus a modal (same tabs as ImagePicker) where clicking an
 * image toggles it in/out of the selection instead of closing the dialog.
 */
export function GalleryPicker({ value, onChange }: { value: string[]; onChange: (urls: string[]) => void }) {
  const t = useTranslations("galleryPicker");
  const tCommon = useTranslations("common");
  const { images, loading, refetch } = useMyImages();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("gallery");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(url: string) {
    onChange(value.includes(url) ? value.filter((u) => u !== url) : [...value, url]);
  }

  function remove(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const image = await uploadImage(file);
      await refetch();
      onChange([...value, image.url]);
    } catch (err) {
      setError(extractErrorMessage(err) || tCommon("uploadError"));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm font-medium text-zinc-600 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
          >
            <Plus className="h-4 w-4" />
            {t("addImages")}
          </button>
        </DialogTrigger>

        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <GalleryVertical className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-xl">{t("title")}</DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400">{t("description")}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <Tabs value={tab} onValueChange={setTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gallery" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <GalleryVertical className="mr-2 h-4 w-4" />
                {t("myImages")}
              </TabsTrigger>
              <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Upload className="mr-2 h-4 w-4" />
                {t("addImage")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="mt-4">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{tCommon("loading")}</p>
                  </div>
                </div>
              )}

              {!loading && images.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <FileImage className="h-8 w-8 text-zinc-400" />
                  </div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{t("noImages")}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((image) => {
                  const isSelected = value.includes(image.url);
                  return (
                    <button
                      type="button"
                      key={image.id}
                      onClick={() => toggle(image.url)}
                      className={cn(
                        "group relative aspect-square overflow-hidden rounded-xl border-2 transition-all hover:shadow-md",
                        isSelected
                          ? "border-blue-500 shadow-md shadow-blue-500/25"
                          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image.url} alt={image.filename} className="h-full w-full object-cover transition-transform group-hover:scale-105" />

                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Upload className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>

                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  loading={uploading}
                  onClick={() => inputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {tCommon("uploading")}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {tCommon("uploadImage")}
                    </>
                  )}
                </Button>

                {error && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileSelected}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" onClick={() => setOpen(false)}>
              {t("done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
