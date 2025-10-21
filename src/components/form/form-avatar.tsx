import { Button } from '../ui/button';
import { Upload } from 'lucide-react';
import { Label } from '../ui/label';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compressToMaxSize } from '@/lib/compress-images';
import { Avatar } from '../ui/custom/avatar';

export const FormAvatar = ({
    displayName,
    maxFileSizeMB = 5,
    value,
    onChange,
}: {
    displayName?: string;
    value?: string | null;
    onChange?: (value: string | null) => void;
    maxFileSizeMB?: number;
}) => {
    if (!onChange) return null;

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxBytes = maxFileSizeMB * 1024 * 1024;
        try {
            const finalFile = file.size > maxBytes
                ? await compressToMaxSize(file, maxBytes)
                : file;

            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = typeof reader.result === 'string' ? reader.result : null;
                if (dataUrl) onChange(dataUrl);
            };
            reader.readAsDataURL(finalFile);
        } catch (err) {
            console.error('Failed to compress image', err);
        } finally {
            e.currentTarget.value = '';
        }
    };

    const removeAvatar = () => {
        onChange('');
    };

    return (
        <AvatarDisplay
            displayAvatar={value || null}
            displayName={displayName}
            handleAvatarChange={handleAvatarChange}
            removeAvatar={removeAvatar}
        />
    );
}

const AvatarDisplay = ({
    displayAvatar,
    displayName,
    handleAvatarChange,
    removeAvatar
}: {
    displayAvatar: string | null;
    displayName?: string;
    handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeAvatar: () => void;
}) => {

    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center">
            <div className="relative flex flex-col items-center justify-center">
                <Avatar src={displayAvatar || undefined} alt={displayName || 'Avatar'} size={96} />
                <Label htmlFor="avatarUpload" className="-translate-y-6">
                    <Button size="sm" variant="outline" asChild>
                        <span>
                            <Upload className="mr-2 h-4 w-4" />
                            {displayAvatar ? t('form-avatar-change') : t('form-avatar-upload')}
                        </span>
                    </Button>
                    <input
                        type="file"
                        id="avatarUpload"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </Label>
            </div>

            {displayAvatar && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeAvatar}
                    className="text-muted-foreground hover:text-destructive"
                >
                    {t('form-avatar-remove')}
                </Button>
            )}
        </div>
    )
}