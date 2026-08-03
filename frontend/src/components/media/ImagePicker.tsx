"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { uploadImage, useMyImages } from "@/features/media/useMedia";
import { extractErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Image,
  Upload,
  Plus,
  Check,
  Loader2,
  AlertCircle,
  GalleryVertical,
  FileImage,
} from "lucide-react";

/**
 * Modal image picker for the connected user: the trigger shows the current
 * selection (or a placeholder), and opens a dialog with two tabs - "My
 * images" lists what they already uploaded (click to select and close),
 * "Add an image" uploads a new one, selects it and closes automatically.
 */
export function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const t = useTranslations("imagePicker");
  const tCommon = useTranslations("common");
  const { images, loading, refetch } = useMyImages();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("gallery");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSelect(url: string) {
    onChange(url);
    setOpen(false);
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
      handleSelect(image.url);
    } catch (err) {
      setError(extractErrorMessage(err) || tCommon("uploadError"));
    } finally {
      setUploading(false);
    }
  }

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
              type="button"
              className="group flex w-full items-center gap-3 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 p-4 text-left transition-all hover:border-blue-400 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-600 dark:hover:bg-blue-900/20"
          >
            {value ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10" />
                </div>
            ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
                  <Image className="h-7 w-7 text-zinc-400" />
                </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                {value ? t("changeImage") : t("title")}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {value ? t("clickToChange") : t("clickToAdd")}
              </p>
            </div>
            <Plus className="h-5 w-5 text-zinc-400 transition-transform group-hover:scale-110 group-hover:text-blue-600 dark:text-zinc-500 dark:group-hover:text-blue-400" />
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
                <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                  {t("description") || "Sélectionnez une image depuis votre galerie ou téléchargez-en une nouvelle"}
                </DialogDescription>
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

            {/* Gallery Tab */}
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
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {t("noImagesDescription") || "Téléchargez votre première image dans l'onglet ci-dessus"}
                    </p>
                  </div>
              )}

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((image) => {
                  const isSelected = value === image.url;
                  return (
                      <button
                          type="button"
                          key={image.id}
                          onClick={() => handleSelect(image.url)}
                          className={cn(
                              "group relative aspect-square overflow-hidden rounded-xl border-2 transition-all hover:shadow-md",
                              isSelected
                                  ? "border-blue-500 shadow-md shadow-blue-500/25"
                                  : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600",
                          )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.url} alt={image.filename} className="h-full w-full object-cover transition-transform group-hover:scale-105" />

                        {/* Selection indicator */}
                        {isSelected && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 shadow-lg">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            </div>
                        )}

                        {/* Hover overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="rounded-full bg-white/90 p-2 shadow-lg dark:bg-zinc-800/90">
                            <Check className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                          </div>
                        </div>
                      </button>
                  );
                })}
              </div>
            </TabsContent>

            {/* Upload Tab */}
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
                        {tCommon("uploading") || "Téléchargement..."}
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

                <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
                  {t("supportedFormats") || "Formats pris en charge : JPEG, PNG, WebP, GIF"}
                </p>

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
        </DialogContent>
      </Dialog>
  );
}