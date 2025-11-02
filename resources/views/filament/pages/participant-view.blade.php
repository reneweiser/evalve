<x-filament-panels::page.simple>
    <form wire:submit="submit" class="fi-sc  fi-sc-has-gap fi-grid">
        {{ $this->form }}
        <x-filament::button type="submit">
            {{ __('participant.submit') }}
        </x-filament::button>
    </form>
</x-filament-panels::page.simple>
