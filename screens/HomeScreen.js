import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon
} from 'react-native-heroicons/outline'
import TrendingMovies from '../components/trendingMovies'
import MovieList from '../components/movieList'
import { StatusBar } from 'expo-status-bar'
import {
  fetchTrendingMovies,
  fetchUpcomingMovies,
  useRatedMovies,
  useRatedSeries
} from '../api/moviesdb'
import { useNavigation } from '@react-navigation/native'
import Loading from '../components/loading'
import { styles } from '../theme'

const ios = Platform.OS === 'ios'

export default function HomeScreen() {
  const [trending, setTrending] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    getTrendingMovies()
    getUpcomingMovies()
  }, [])

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies()
    console.log('got trending', data.results.length)
    if (data && data.results) setTrending(data.results)
    setLoading(false)
  }

  const getUpcomingMovies = async () => {
    setLoading(true)
    const data = await fetchUpcomingMovies()
    console.log('got upcoming', data.results.length)
    if (data && data.results) setUpcoming(data.results)
    setLoading(false)
  }

  const {
    data: topRated,
    isLoading: loadingRatedMovies,
    isSuccess
  } = useRatedMovies({ page: 1 })

  const { data: topRatedSeries, isLoading: loadingRatedSeries } =
    useRatedSeries()

  const isLoading = loading || loadingRatedMovies || loadingRatedSeries

  console.log(topRated)

  return (
    <View className='flex-1 bg-neutral-800'>
      {/* search bar */}
      <SafeAreaView className={ios ? '-mb-2' : 'py-3'}>
        <StatusBar style='light' />
        <View className='flex flex-row justify-between items-center mx-4'>
          <Bars3CenterLeftIcon size='30' strokeWidth={2} color='white' />
          <Text className='text-neutral-100 text-3xl font-bold'>
            <Text className='text-yellow-400'>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <MagnifyingGlassIcon size='30' strokeWidth={2} color='white' />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {isLoading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {/* Trending Movies Carousel */}
          {trending.length > 0 && <TrendingMovies data={trending} />}

          {upcoming.length > 0 && (
            <MovieList title='Upcoming Movies' data={upcoming} hideSeeAll />
          )}

          {topRated?.results.length > 0 && (
            <MovieList title='Top Rated Movies' data={topRated?.results} />
          )}
          {topRatedSeries?.results.length > 0 && (
            <MovieList
              title='Top Rated Series'
              data={topRatedSeries?.results}
            />
          )}
        </ScrollView>
      )}
    </View>
  )
}
