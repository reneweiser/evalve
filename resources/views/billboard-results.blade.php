<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    @vite('resources/css/app.css')
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <title>Results - {{ $question->text }}</title>
</head>
<body class="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
    <div class="w-full h-screen flex flex-col items-center justify-center p-8">
        <div class="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
            <!-- Question Title -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-white mb-2">{{ $question->text }}</h1>
                @if($results['type'] === 'image')
                    <p class="text-2xl text-gray-300">{{ $results['message'] }}</p>
                @else
                    <p class="text-xl text-gray-300">
                        @if($results['type'] === 'single_choice')
                            Total Votes: {{ $results['totalVotes'] }}
                        @elseif($results['type'] === 'multiple_choice')
                            Total Responses: {{ $results['totalResponses'] }}
                        @elseif($results['type'] === 'semantic_differential')
                            Total Responses: {{ $results['totalResponses'] }}
                        @endif
                    </p>
                @endif
            </div>

            <!-- Chart Container -->
            @if($results['type'] !== 'image')
                <div class="w-full" style="height: 60vh;">
                    <canvas id="resultsChart"></canvas>
                </div>
            @else
                <div class="flex items-center justify-center h-96">
                    <div class="text-center">
                        <svg class="w-32 h-32 mx-auto text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        <p class="text-5xl font-bold text-white">{{ $results['viewCount'] }}</p>
                        <p class="text-2xl text-gray-300 mt-2">
                            {{ $results['viewCount'] === 1 ? 'Participant' : 'Participants' }}
                        </p>
                    </div>
                </div>
            @endif
        </div>
    </div>

    @if($results['type'] !== 'image')
        <script>
            const ctx = document.getElementById('resultsChart').getContext('2d');
            const results = @json($results);

            let chartConfig = {};

            if (results.type === 'single_choice' || results.type === 'multiple_choice') {
                // Bar chart for choice questions
                chartConfig = {
                    type: 'bar',
                    data: {
                        labels: results.results.map(r => r.label),
                        datasets: [{
                            label: results.type === 'single_choice' ? 'Votes' : 'Selections',
                            data: results.results.map(r => r.count),
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 2,
                            borderRadius: 8,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1,
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    font: {
                                        size: 32
                                    }
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }
                            },
                            x: {
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    font: {
                                        size: 32
                                    }
                                },
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                };
            } else if (results.type === 'semantic_differential') {
                // Vertical line chart for semantic differential
                console.log(results)
                chartConfig = {
                    type: 'line',
                    data: {
                        labels: results.results.map(r => r.label),
                        datasets: [{
                            label: 'Average Rating',
                            data: results.results.map(r => r.average),
                            // backgroundColor: 'rgba(168, 85, 247, 0.2)',
                            borderColor: 'rgba(168, 85, 247, 1)',
                            borderWidth: 3,
                            pointBackgroundColor: 'rgba(168, 85, 247, 1)',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                            pointHoverRadius: 8,
                            tension: 0,
                            fill: true,
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: false
                            }
                        },
                        scales: {
                            x: {
                                min: results.scale.min,
                                max: results.scale.max,
                                ticks: {
                                    stepSize: 1,
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    font: {
                                        size: 32
                                    }
                                },
                                grid: {
                                    color: 'rgba(255, 255, 255, 0.1)'
                                }
                            },
                            y: {
                                ticks: {
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    font: {
                                        size: 24
                                    },
                                    maxRotation: 0,
                                    minRotation: 0
                                },
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                };
            }

            new Chart(ctx, chartConfig);

            // Auto-refresh every 5 seconds to update results
            // setTimeout(() => {
            //     window.location.reload();
            // }, 5000);
        </script>
    @endif
</body>
</html>
