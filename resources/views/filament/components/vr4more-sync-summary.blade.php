<div class="space-y-2 text-sm">
    <p class="flex items-center gap-2">
        <span class="font-medium">✓ Identical:</span>
        <span class="text-gray-600 dark:text-gray-400">{{ $identical_count }} POIs (no changes needed)</span>
    </p>
    @if ($conflicts_count > 0)
    <p class="flex items-center gap-2 text-warning-600 dark:text-warning-400">
        <span class="font-medium">⚠️ Conflicts:</span>
        <span>{{ $conflicts_count }} POIs will be overwritten with Evalve's data</span>
    </p>
    @endif
    @if ($new_count > 0)
    <p class="flex items-center gap-2 text-success-600 dark:text-success-400">
        <span class="font-medium">+ New:</span>
        <span>{{ $new_count }} POIs will be created in VR4More</span>
    </p>
    @endif
</div>
