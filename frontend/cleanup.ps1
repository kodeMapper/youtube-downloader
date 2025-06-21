# Create a list of files to remove
$filesToRemove = @(
    "src/app/page-backup.tsx",
    "src/app/page-backup.jsx",
    "src/app/page-clean-final.jsx",
    "src/app/page-clean.jsx",
    "src/app/page-corrupted.tsx",
    "src/app/page-final.jsx",
    "src/app/page-fixed.tsx",
    "src/app/page-minimal.tsx",
    "src/app/page-new.jsx",
    "src/app/page-new.tsx",
    "src/app/page-simple.jsx",
    "src/app/page-simple.tsx",
    "src/app/page-temp.jsx",
    "src/app/page-test.tsx",
    "src/app/page-working.jsx",
    "src/app/page-working.tsx",
    "src/app/page.jsx.dora-backup",
    "src/app/page_broken.jsx",
    "src/app/page_clean.tsx",
    "src/app/page_fixed.jsx",
    "src/app/page_premium.tsx",
    "src/app/simple-page.jsx",
    "src/app/test-basic/page.jsx",
    "src/app/test-page.tsx",
    "src/app/test-simple.jsx",
    "src/app/test/page.jsx",
    "src/components/AboutSection.tsx",
    "src/components/AnimatedBackground.tsx",
    "src/components/AnimatedButton.tsx",
    "src/components/CinematicBackground.tsx",
    "src/components/CinematicBackgroundNew.tsx",
    "src/components/CustomCursor.tsx",
    "src/components/DoraInspired3DBackground.jsx",
    "src/components/DoraInspired3DScene.tsx",
    "src/components/DynamicLighting.tsx",
    "src/components/DynamicParticleSystem.tsx",
    "src/components/Enhanced3DButton.tsx",
    "src/components/Enhanced3DCard.tsx",
    "src/components/Enhanced3DIcon.tsx",
    "src/components/EnhancedProgressBar.tsx",
    "src/components/FeaturesSection.tsx",
    "src/components/Floating3DIcon.tsx",
    "src/components/FloatingElements.tsx",
    "src/components/GlassmorphismCard.tsx",
    "src/components/HeroSection.tsx",
    "src/components/HeroSectionFixed.tsx",
    "src/components/HolographicCard.tsx",
    "src/components/Immersive3DButton.tsx",
    "src/components/Immersive3DCard.tsx",
    "src/components/ImmersiveScene3D.tsx",
    "src/components/Interactive3DButton.tsx",
    "src/components/Interactive3DCard.tsx",
    "src/components/Interactive3DCardNew.tsx",
    "src/components/InteractiveRipples.tsx",
    "src/components/MagicButton.tsx",
    "src/components/MagicCursor.tsx",
    "src/components/ParticleSystem.tsx",
    "src/components/PreLoader.tsx",
    "src/components/PreLoaderFixed.tsx",
    "src/components/PremiumBackground.tsx",
    "src/components/PremiumButton.tsx",
    "src/components/PremiumLoadingScreen.tsx",
    "src/components/Section3DBackground.tsx",
    "src/components/SectionLayout.tsx",
    "src/components/Simple3DBackground.tsx",
    "src/components/Simple3DButton.tsx",
    "src/components/Simple3DCard.tsx",
    "src/components/Simple3DElements.tsx",
    "src/components/SimpleBackground.tsx",
    "src/components/StableImmersiveScene.tsx",
    "src/components/ThreeDCard.tsx",
    "src/components/ThreeDStructure.tsx",
    "src/components/ThreeJSBackground.tsx",
    "src/components/ThreeJSButton.tsx",
    "src/components/ThreeJSCard.tsx",
    "src/components/ThreeJSScene.tsx",
    "src/components/UltraGlassCard.tsx"
)

# Create backup folder if it doesn't exist
$backupDir = "backup-legacy-files"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir
}

# Process each file
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        # Create necessary subdirectories in backup folder
        $fileDir = Split-Path -Parent $file
        $backupSubDir = Join-Path -Path $backupDir -ChildPath $fileDir
        if (-not (Test-Path $backupSubDir)) {
            New-Item -ItemType Directory -Path $backupSubDir -Force
        }
        
        # Move file to backup folder
        Copy-Item -Path $file -Destination (Join-Path -Path $backupDir -ChildPath $file) -Force
        Remove-Item -Path $file -Force
        Write-Host "Removed: $file"
    }
}

Write-Host "Cleanup completed! All legacy files moved to $backupDir"
