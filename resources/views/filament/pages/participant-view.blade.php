<x-filament-panels::page.simple style="zoom:{{ \App\Evalve\SceneObjectSettings::asCollection('zoom')[0] }};">
    <form wire:submit="submit" class="fi-sc  fi-sc-has-gap fi-grid">
        {{ $this->form }}
        @if($this->question && $this->question->type !== 'image')
            <x-filament::button type="submit">
                {{ __('participant.submit') }}
            </x-filament::button>
        @endif
    </form>
</x-filament-panels::page.simple>
